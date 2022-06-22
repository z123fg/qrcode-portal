import OSS from "ali-oss";
import axios from "axios";
import dataURL2Blob from "../utils/dataURL2Blob";
import { getSTSToken, getUploadLink } from "./sts";

const takeLast4Digits = (str) => str.slice(str.length - 4);

const userDataClient = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/userData`,
    timeout: 10000,
});

async function uploadProfileImage2OSS(filenameWithExtensionAndPath, mimeString, file) {
    // object表示上传到OSS的文件名称。
    // file表示浏览器中需要上传的文件，支持HTML5 file和Blob类型。
    const { data: signedURL } = await getUploadLink(`${filenameWithExtensionAndPath}`, mimeString);
    console.log("signedURL", signedURL);

    return axios.put(signedURL, file, { headers: { "Content-Type": mimeString } });
    //return client.put(`profile-photo/${filename}`, file);
}

userDataClient.interceptors.request.use((req) => {
    let token = "";
    try {
        token = JSON.parse(localStorage.getItem("jwt")).token;
    } catch (err) {
        console.log("failed to get jwt from localstorage");
        localStorage.removeItem("jwt");
    }
    req.headers.authorization = "bearer " + token;
    return req;
});

const uploadImageForSingleUserData = async (userData) => {
    try {
        const { profileImage, certNum, idNum } = userData;
        if (profileImage.content.length < 5) {
            userData.profileImage.content = "";
        } else {
            const { file: imageFile, extension, mimeString } = dataURL2Blob(profileImage.content);
            const filenameWithExtensionAndPath = `/profile-photo/${takeLast4Digits(
                certNum.content
            )}_${takeLast4Digits(idNum.content)}.${extension}`;
            const res = await uploadProfileImage2OSS(filenameWithExtensionAndPath, mimeString, imageFile);
            console.log("url", res);
            profileImage.content = `https://qrcode-portal.oss-cn-hangzhou.aliyuncs.com${filenameWithExtensionAndPath}`;
        }
    } catch (err) {
        console.log("uploading profile image err", err);
        throw new axios.Cancel("上传证件照失败");
    }
};

const uploadImagesForUserDataList = async (userDataList) => {
    try {
        const promiseArr = userDataList.map((userData, index) => {
            const { profileImage, certNum, idNum } = userData;
            return (async () => {
                if (profileImage.content.length < 5) {
                    userData.profileImage.content = "";
                } else {
                    const {
                        file: imageFile,
                        extension,
                        mimeString,
                    } = dataURL2Blob(userData.profileImage.content);
                    console.log("file", imageFile, profileImage);
                    const filenameWithExtensionAndPath = `/profile-photo/${certNum.content}-${takeLast4Digits(
                        idNum.content
                    )}.${extension}`;
                    await uploadProfileImage2OSS(filenameWithExtensionAndPath, mimeString, imageFile);
                    profileImage.content = `https://qrcode-portal.oss-cn-hangzhou.aliyuncs.com${filenameWithExtensionAndPath}`;
                }
            })();
        });
        await Promise.all(promiseArr);
    } catch (err) {
        console.log("uploading profile image err", err);
        throw new axios.Cancel("上传证件照列表失败");
    }
};

export const getGlobalUserDataList = async () => {
    const res = await userDataClient.get("/");
    return res.data.result;
};

export const createSingleUserData = async (userData) => {
    await uploadImageForSingleUserData(userData);
    return userDataClient.post("/", userData);
};

export const createUserDataList = async (userDataList) => {
    await uploadImagesForUserDataList(userDataList);
    const res = await userDataClient.post("/list", userDataList, { isList: true });
    return res;
};

export const deleteUserData = async (id) => {
    const res = await userDataClient.delete(`/${id}`);
    return res;
};

export const updateUserData = async (userData) => {
    await uploadImageForSingleUserData(userData);
    const res = await userDataClient.put(`/${userData._id}`, userData);
    return res;
};
