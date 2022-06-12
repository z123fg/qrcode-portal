import axios from "axios";

const authClient = axios.create({
    baseURL: "http://localhost:4000/api/auth",
    timeout: 1000,
});

authClient.interceptors.response.use((res) => {
    console.log("res",res)
    if (res?.data?.data?.token) {
        localStorage.setItem("jwt", JSON.stringify({username:res.data.data.username,token:res.data.data.token}));
    }
    return res;
});

export const register = async (username, password) => {
    return authClient.post("/register", { username, password });
};

export const login = async (username, password) => {
    return authClient.post("/login", { username, password });
};
