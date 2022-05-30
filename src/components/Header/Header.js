import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import LoginDialog from "../LoginDialog/LoginDialog";
import "./Header.css"

const Header = ({userInfo}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
    }
    return (
        <header className="header">
             <Typography variant="h6" color="#3E312E"   component="div">QRcode Portal </Typography >
            <div>{userInfo !== null?<Button color="secondary" variant="contained" onClick={()=>{setIsDialogOpen(true)}}>login</Button>:<Button>logout</Button>}</div>
            <LoginDialog open={isDialogOpen} handleClose={handleCloseDialog}/>
        </header>
    )
}


export default Header;