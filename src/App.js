import "./App.css";
import React, { createContext, useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Actions from "./components/Actions/Actions";
import { getGlobalUserDataList } from "./services/userData";
import GlobalUserTable from "./components/GlobalTable/GlobalTable";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

export const PortalContext = createContext();

function App() {
    const [globalUserDataList, setGlobalUserDataList] = useState([]);
    const [alertInfo, showAlert] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isBackDropOpen, showBackdrop] = useState(false);

    useEffect(() => {
        try {
            const temp = JSON.parse(localStorage.getItem("jwt"));
            if (temp) {
                setUserInfo(temp);
            }
        } catch (err) {
            console.log("auto login failed", err);
            localStorage.removeItem("jwt");
        }
    }, []);
    useEffect(() => {
        if (userInfo) {
            refreshGlobalUserDataList();
        } else {
            setGlobalUserDataList([]);
        }
    }, [userInfo]);

    const refreshGlobalUserDataList = async () => {
        showBackdrop(true);
        try {
            const result = await getGlobalUserDataList();
            console.log("globaluserdatalist", result);
            setGlobalUserDataList(result);
        } catch (err) {
            console.log("err", err);
            if (err?.response?.status === 401) {
                alert("登录信息已经失效了，需要重新登陆。");
                setUserInfo(null);
                localStorage.removeItem("jwt");
            } else {
                alert(`获取证书列表失败了，这里是错误信息，可以问我：${err?.response?.data?.message}`);
            }
        }
        showBackdrop(false);
    };

    return (
        <PortalContext.Provider
            value={{ refreshGlobalUserDataList, userInfo, setUserInfo, showBackdrop, alertInfo, showAlert }}
        >
            <div className="App">
                <Header />
                <div className="main">
                    {userInfo !== null ? (
                        <>
                            <Actions />
                            <GlobalUserTable userDataList={globalUserDataList} />
                        </>
                    ) : (
                        <div style={{ margin: "50px" }}>
                            <Typography>请先登录。</Typography>{" "}
                        </div>
                    )}
                </div>
            </div>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isBackDropOpen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </PortalContext.Provider>
    );
}

export default App;
