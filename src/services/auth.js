import axios from "axios";

const authClient = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/auth`,
    timeout: 3000,
});

authClient.interceptors.response.use((res) => {
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
