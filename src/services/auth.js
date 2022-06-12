import axios from "axios";

const authClient = axios.create({
    baseURL: "http://localhost:4000/api/auth",
    timeout: 1000,
})

authClient.interceptors.response.use((res) => {
    console.log("auth req interceptor", res);
    localStorage.setItem("jwt", res.data.data.token)
    return res

})

export const register = async (username, password) => {
    const res = await authClient.post("/register", { username, password }).catch((err) => { console.log("register err", err) });
    console.log("register response", res);
    return res

}

export const login = async (username, password) => {

    const res = await authClient.post("/login", { username, password }).catch((err) => { console.log("login err", err) });
    console.log("login response", res)
    return res
}