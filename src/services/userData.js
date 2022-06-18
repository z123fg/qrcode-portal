import OSS from "ali-oss";
import axios from "axios";
import dataURL2Blob from "../utils/dataURL2Blob";
import { getSTSToken } from "./sts";

const createOSSClient = (STS) =>
    new OSS({
        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
        region: "oss-cn-hangzhou",
        // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
        accessKeyId: STS.AccessKeyId,
        accessKeySecret: STS.AccessKeySecret,
        // 从STS服务获取的安全令牌（SecurityToken）。
        stsToken: STS.SecurityToken,
        // 刷新临时访问凭证的时间间隔，单位为毫秒。
        // 填写Bucket名称。,
        refreshSTSToken: () => getSTSToken(),
        refreshSTSTokenInterval: 3500000,
        bucket: "qrcode-portal",
    });

async function upload2OSS(filename, file, client) {
    // object表示上传到OSS的文件名称。
    // file表示浏览器中需要上传的文件，支持HTML5 file和Blob类型。
    return client.put(`profile-photo/${filename}`, file);
}

const takeLast4Digits = (str) => str.slice(str.length - 4);

const userDataClient = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/userData`,
    timeout: 3000,
});

const isSTSRequest = (req) => {
    return req.method === "put" || req.method === "post";
};

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

userDataClient.interceptors.request.use(
    async (req) => {
        const STS = await getSTSToken();
        const client = createOSSClient(STS);
        try {
            if (req.isList) {
                const promiseArr = req.data.map((userData, index) => {
                    return new Promise((resolve, reject) => {
                        if (userData.profileImage.content.length < 5) {
                            resolve({ url: "" });
                        }
                        const { file: imageFile, extension } = dataURL2Blob(userData.profileImage.content);
                        const filename = `${takeLast4Digits(userData.certNum.content)}-${takeLast4Digits(
                            userData.idNum.content
                        )}.${extension}`;
                        resolve(upload2OSS(filename, imageFile, client));
                    }).then((res) => {
                        req.data[index].profileImage.content = res.url;
                    });
                });
                await Promise.all(promiseArr);
            } else {
                const { profileImage, certNum, idNum } = req.data;
                if (profileImage.content.length < 5) {
                    req.data.profileImage.content = "";
                    return req;
                }
                const { file: imageFile, extension } = dataURL2Blob(profileImage.content);
                const filename = `${takeLast4Digits(certNum.content)}-${takeLast4Digits(
                    idNum.content
                )}.${extension}`;
                const res = await upload2OSS(filename, imageFile, client);
                req.data.profileImage.content = res.url;
            }
        } catch (err) {
            console.log("uploading profile image err", err);
            throw new axios.Cancel("上传证件照失败");
        }

        return req;
    },
    null,
    { runWhen: isSTSRequest }
);

export const getGlobalUserDataList = async () => {
    const res = await userDataClient.get("/");
    return res.data.result;
};

export const createSingleUserData = async (userData) => {
    return userDataClient.post("/", userData);
};

export const createUserDataList = async (userDataList) => {
    const res = await userDataClient.post("/list", userDataList, { isList: true });
    return res;
};

export const deleteUserData = async (id) => {
    const res = await userDataClient.delete(`/${id}`);
    return res;
};

export const updateUserData = async (userData) => {
    const res = await userDataClient.put(`/${userData._id}`, userData);
    return res;
};
