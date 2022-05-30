import React, { useState } from "react";
import { Button, Typography, Paper } from "@mui/material";
import "./Actions.css";
import EditDialog from "../EditDialog/EditDialog";

const Actions = () => {
    const[isDialogOpen, setIsDialogOpen] = useState(false)
    const handleCloseDialog = () => {
        setIsDialogOpen(false)
    }

    return (
        <div className="actions-container">
            <Paper className="actions__paper">
                <Button variant="contained" onClick={()=>setIsDialogOpen(true)}>Add one user</Button>
                <Typography>输入用户信息 </Typography>
            </Paper>
            <Paper className="actions__paper">
                <Button variant="contained">Add multiple user</Button>
                <Typography>上传用户列表（xsl）</Typography>
            </Paper>
            <EditDialog open={isDialogOpen} handleClose={handleCloseDialog}/>
        </div>
    );
};

export default Actions;
