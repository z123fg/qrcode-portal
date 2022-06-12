import axios from "axios";

const userDataClient = axios.create({
    baseURL: "http://localhost:4000/api/userData",
    timeout: 1000,
});

userDataClient.interceptors.request.use((req) => {
    let token = "";
    try {
        token = JSON.parse(localStorage.getItem("jwt")).token;
    } catch (err) {
        console.log("failed to get jwt from localstorage",)
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
    return userDataClient.post("/", userData);
};

export const createUserDataList = async (userDataList) => {
    const res = await userDataClient
        .post("/list", userDataList)
        .catch((err) => console.log("createUserDataList err", err));
    console.log("createUserDataList res", res);
    return res;
};

export const deleteUserData = async (id) => {
    const res = await userDataClient.delete(`/${id}`)
    return res;
};

export const updateUserData = async (userData) => {
    const res = await userDataClient
        .put(`/${userData._id}`, userData)
    return res;
};
