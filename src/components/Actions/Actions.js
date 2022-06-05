import React, { useEffect, useState } from "react";
import { Button, Typography, Paper } from "@mui/material";
import "./Actions.css";
import EditDialog from "../EditDialog/EditDialog";
import csv2JSON from "../../utils/csv2JSON";

const Actions = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [uploadValue, setUploadValue] = useState("");
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    useEffect(() => {
        fetch("../../public/metallographic-testing(entry).pdf")
            .then((res) => {
                return res.blob();
            })
            .then((blob) => {
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () {
                    var base64data = reader.result;;
                };
            });
    }, []);

    const handleUploadFile = async (e) => {
        const result = await csv2JSON(e.target.files[0]);
    };

    return (
        <div className="actions-container">
            <Paper className="actions__paper">
                <Button variant="contained" onClick={() => setIsDialogOpen(true)}>
                    Add one user
                </Button>
                <Typography>输入用户信息 </Typography>
            </Paper>
            <Paper className="actions__paper">
                <label htmlFor="csv-upload">
                    <input
                        onClick={() => setUploadValue("")}
                        value={uploadValue}
                        id="csv-upload"
                        type={"file"}
                        accept={".csv"}
                        style={{ display: "none" }}
                        onChange={handleUploadFile}
                    />
                    <Button component="span" variant="contained">
                        Add multiple user
                    </Button>
                </label>

                <Typography>上传用户列表（xsl）</Typography>
            </Paper>
            <EditDialog open={isDialogOpen} handleClose={handleCloseDialog} />
        </div>
    );
};

export default Actions;
