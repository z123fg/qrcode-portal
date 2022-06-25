import { Alert, Button, Typography } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { PortalContext } from "../../App";
import AuthDialog from "../AuthDialog/AuthDialog";
import "./Header.css";

const Header = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [authDialogType, setAuthDialogType] = useState("login");
    const { userInfo, setUserInfo, alertInfo } = useContext(PortalContext);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const timeoutRef = useRef();

    useEffect(() => {
        if (alertInfo) {
            setIsAlertVisible(true);
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setIsAlertVisible(false);
            }, 10000);
        }
    }, [alertInfo]);

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleClickLogout = () => {
        setUserInfo(null);
    };
    const handleClickLogin = () => {
        setIsDialogOpen(true);
        setAuthDialogType("login");
    };
    const handleClickRegister = () => {
        setIsDialogOpen(true);
        setAuthDialogType("register");
    };

    return (
        <div>
            <header className="header">
                <Typography variant="h6" color="whitesmoke" component="div">
                    QRCode Portal
                </Typography>
                <div>
                    {userInfo === null ? (
                        <div style={{ display: "flex", gap: "10px" }}>
                            <Button color="secondary" variant="contained" onClick={handleClickLogin}>
                                登录
                            </Button>
                            <Button color="secondary" variant="contained" onClick={handleClickRegister}>
                                注册
                            </Button>
                        </div>
                    ) : (
                        <Button color="secondary" variant="contained" onClick={handleClickLogout}>
                            登出
                        </Button>
                    )}
                </div>
                <AuthDialog open={isDialogOpen} type={authDialogType} handleClose={handleCloseDialog} />
            </header>
            <div style={{ position: "relative" }}>
                {isAlertVisible && (
                    <Alert style={{ position: "absolute", width: "100%" }} severity={alertInfo?.type}>
                        {alertInfo?.message}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default Header;
