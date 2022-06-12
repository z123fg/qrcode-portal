import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import AuthDialog from "../LoginDialog/AuthDialog";
import LoginDialog from "../LoginDialog/AuthDialog";
import "./Header.css"

const Header = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [authDialogType, setAuthDialogType] = useState("login")
    const [userInfo, setUserInfo] = useState(null)
    const handleCloseDialog = () => {
        setIsDialogOpen(false)
    }

    const handleClickLogout = () => {
        setUserInfo(null)
    }
    const handleClickLogin = () => {
        setIsDialogOpen(true);
        setAuthDialogType("login")
    }

    const handleClickRegister = () => {
        setIsDialogOpen(true);
        setAuthDialogType("register");
    }
    return (
        <header className="header">
            <Typography variant="h6" color="#3E312E" component="div">QRcode Portal </Typography >
            <div>{userInfo === null ?
                <div style={{display:"flex", gap:"10px"}}>
                    <Button color="secondary" variant="contained" onClick={handleClickLogin}>login</Button>
                    <Button color="secondary" variant="contained" onClick={handleClickRegister}>Register</Button>
                </div>
                : <Button color="secondary" variant="contained" onClick={handleClickLogout}>logout</Button>}
            </div>
            <AuthDialog open={isDialogOpen} type={authDialogType} handleClose={handleCloseDialog} />
        </header>
    )
}


export default Header;