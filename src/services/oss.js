import axios from "axios";
import { getCanvas, getQRCodeLink, prepareCertImageListForUpload } from "../utils/canvasUtils";
import dataURL2Blob from "../utils/dataURL2Blob";
import { takeLast4Digits } from "../utils/takeLast4Digits";
import { getUploadLink } from "./sts";

export async function uploadProfileImage2OSS(userData) {
    const { file: imageFile, extension, mimeString } = dataURL2Blob(userData.profileImage.content);
    const filenameWithExtensionAndPath = `/profile-photo/${userData.certNum.content}_${takeLast4Digits(
        userData.idNum.content
    )}.${extension}`;
    // object表示上传到OSS的文件名称。
    // file表示浏览器中需要上传的文件，支持HTML5 file和Blob类型。
    const { data: signedURL } = await getUploadLink(`${filenameWithExtensionAndPath}`, mimeString);

    await axios.put(signedURL, imageFile, { headers: { "Content-Type": mimeString } });
    userData.profileImage.content = `https://qrcode-portal.oss-cn-hangzhou.aliyuncs.com${filenameWithExtensionAndPath}`;
    //return client.put(`profile-photo/${filename}`, file);
}

export async function uploadCertImage2OSS(userData) {

    const { file: imageFile, extension, mimeString } = dataURL2Blob(userData.certImage.content);
    const filenameWithExtensionAndPath = `/cert-image/${userData.certNum.content}_${takeLast4Digits(
        userData.idNum.content
    )}.${extension}`;
    // object表示上传到OSS的文件名称。
    // file表示浏览器中需要上传的文件，支持HTML5 file和Blob类型。
    const { data: signedURL } = await getUploadLink(`${filenameWithExtensionAndPath}`, mimeString);

    await axios.put(signedURL, imageFile, { headers: { "Content-Type": mimeString } });
    userData.certImage = { type: "image", content: getQRCodeLink(userData), isSprite: false };
    //userData.profileImage.content = `https://qrcode-portal.oss-cn-hangzhou.aliyuncs.com${filenameWithExtensionAndPath}`;
}

export const uploadImageForSingleUserData = async (userData) => {
    try {
        const { profileImage } = userData;
        if (profileImage.content.length < 5) {
            userData.profileImage.content = "";
        } else {
            await uploadProfileImage2OSS(userData);
            
        }
        await uploadCertImage2OSS(userData);
    } catch (err) {
        console.log("uploading profile image err", err);
        throw new axios.Cancel(`上传证件照失败, 这里是原因：${JSON.stringify(err)}`);
    }
};

export const uploadImagesForUserDataList = async (userDataList,setLinearProgressProps) => {
    let count = 0;
    try {
        //await prepareCertImageListForUpload(userDataList);
        const promiseArr = userDataList.map((userData, index) => {
            const { profileImage } = userData;
            return (async () => {
                if (profileImage.content.length < 5) {
                    profileImage.content = "";
                } else {
                    await uploadProfileImage2OSS(userData);
                }
                await uploadCertImage2OSS(userData);
                count++;
                setLinearProgressProps({progress:Math.round(count/userDataList.length*100), title:"正在上传证书图片及信息...", open:true})
            })();
        });
        await Promise.all(promiseArr);
    } catch (err) {
        console.log("uploading profile image err", err);
        throw new axios.Cancel(`上传证件照列表失败, 这里是原因：${JSON.stringify(err)}`);
    }
};
