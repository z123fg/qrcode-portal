import axios from "axios"

const userDataClient = axios.create({
    baseURL: "http://localhost:4000/api/userData",
    timeout: 1000,
})

userDataClient.interceptors.request.use((req) => {
    req.headers.authorization = "bearer " + localStorage.getItem("jwt");
    return req
})

export const getGlobalUserDataList = async () => {
    try {
        const res = await userDataClient.get("/");
        return res.data.result;
    } catch (err) {
        console.log("getGlobalUserDataList err", err.response.data.message)
    }
}

export const createSingleUserData = async (userData, cb) => {
    try {
        const res = await userDataClient.post("/", userData);
        cb();
        return res.data.result
    } catch (err) {
        console.log("createSingleUserData err", err)
    }
}

export const createUserDataList = async (userDataList) => {
    const res = await userDataClient.post("/list", userDataList).catch(err => console.log("createUserDataList err", err));
    console.log("createUserDataList res", res)
    return res;
}


export const deleteUserData = async (id) => {
    const res = await userDataClient.delete(`/${id}`).catch(err => console.log("deleteUserData err", err));
    console.log("deleteUserData res", res)
    return res;
}


export const updateUserData = async (userData) => {
    const res = await userDataClient.put(`/${userData.id}`, userData).catch(err => console.log("deleteUserData err", err));
    console.log("deleteUserData res", res)
    return res;
}

