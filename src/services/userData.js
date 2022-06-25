import OSS from "ali-oss";
import axios from "axios";
import dataURL2Blob from "../utils/dataURL2Blob";
import { uploadImageForSingleUserData, uploadImagesForUserDataList } from "./oss";
import { getSTSToken, getUploadLink } from "./sts";


const userDataClient = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/userData`,
    timeout: 10000,
});



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



export const getGlobalUserDataList = async () => {
    const res = await userDataClient.get("/");
    return res.data.result;
};

export const createSingleUserData = async (userData) => {
    await uploadImageForSingleUserData(userData);
    return userDataClient.post("/", userData);
};

export const createUserDataList = async (userDataList,setLinearProgressProps) => {
    await uploadImagesForUserDataList(userDataList,setLinearProgressProps);
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
