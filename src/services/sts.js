import axios from "axios";

const stsClient = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/sts`,
    timeout: 10000,
});

stsClient.interceptors.request.use((req) => {
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

export const getSTSToken = async () => {
            const res = await stsClient.get("/");
            return res.data.data.Credentials;   
};

export const getUploadLink = async (filename, mimeString) => {
    const res = await stsClient.post(`/upload`,{filename, mimeString}); 
    return res
};

export const getDownloadLink = async (filename) => {
    const res = await stsClient.post("/download",{filename}); 
    return res
};