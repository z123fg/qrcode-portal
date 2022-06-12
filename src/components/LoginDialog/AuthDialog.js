import React, { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions } from "@mui/material";
import "./AuthDialog.css";
import { login, register } from "../../services/auth";

const AuthDialog = ({ open, handleClose, type }) => {

    const [userInfo, setUserInfo] = useState({ username: "", password: "" });
    const handleEdit = (e) => {
        setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        type==="login"?
        login(userInfo.username, userInfo.password)
        :
        register(userInfo.username, userInfo.password)
    };
    return (
        <Dialog open={open} className="login-dialog">
            <DialogTitle>{type==="login"?"Login":"Register"}</DialogTitle>
            <DialogContent className="login-dialog_form">
                <TextField
                    style={{ margin: "20px" }}
                    onChange={handleEdit}
                    value={userInfo.username}
                    name="username"
                    label="Username"
                    variant="outlined"
                />
                <TextField
                    style={{ margin: "20px" }}
                    onChange={handleEdit}
                    value={userInfo.password}
                    name="password"
                    label="Password"
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit}>Submit</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AuthDialog;
