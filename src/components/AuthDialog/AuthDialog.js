import React, { useContext, useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions } from "@mui/material";
import "./AuthDialog.css";
import { login, register } from "../../services/auth";
import { PortalContext } from "../../App";

const AuthDialog = ({ open, handleClose, type }) => {
    const [form, setForm] = useState({ username: "", password: "" });
    const { setUserInfo,showBackdrop,showAlert } = useContext(PortalContext);
    const handleEdit = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        showBackdrop(true)
        if (type === "login") {
            try {
                const res = await login(form?.username, form?.password);
                setUserInfo({ username:res?.data?.data?.username, token: res?.data?.data?.token });
                handleClose();
                showAlert({type:"success",message:"欢迎！登陆成功。"})
            } catch (err) {
                setUserInfo(null);
                alert(`登录失败，这个是原因，可以问我：${err?.response?.data?.message||err}`);
            }
        } else {
            try {
                 await register(form.username, form.password);
                handleClose();
                showAlert({type:"success",message:"注册成功！请登录。"})
            } catch (err) {
                alert(`注册失败，这个是原因，可以问我：${err?.response?.data?.message||err}`);
            }
        }
        showBackdrop(false)
    };
    return (
        <Dialog open={open} className="login-dialog">
            <DialogTitle>{type === "login" ? "登录" : "注册"}</DialogTitle>
            <DialogContent className="login-dialog_form">
                <TextField
                    style={{ margin: "20px" }}
                    onChange={handleEdit}
                    value={form.username}
                    name="username"
                    label="用户名"
                    variant="outlined"
                />
                <TextField
                    style={{ margin: "20px" }}
                    onChange={handleEdit}
                    type="password"
                    value={form.password}
                    name="password"
                    label="密码"
                    variant="outlined"
                />
              
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit}>提交</Button>
                <Button onClick={handleClose}>取消</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AuthDialog;
