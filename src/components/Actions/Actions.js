import React, { useContext, useEffect, useState } from "react";
import { Button, Typography, Paper } from "@mui/material";
import "./Actions.css";
import EditDialog from "../EditDialog/EditDialog";
import csv2JSON from "../../utils/csv2JSON";
import { UserContext } from "../../App";
import curUserData from "../../mockData/curUserData";
import defaultCurUserData from "../../mockData/defaultCurUserData";

const Actions = () => {
    const { openEditDialog, setCurUserData, openUploadListDialog} = useContext(UserContext);
    const [uploadValue, setUploadValue] = useState("");

    useEffect(() => {
        fetch("../../public/metallographic-testing(entry).pdf")
            .then((res) => {
                return res.blob();
            })
            .then((blob) => {
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () {
                    var base64data = reader.result;
                };
            });
    }, []);

    const handleUploadFile = async (e) => {
        const result = await csv2JSON(e.target.files[0]);
    };
    const handleClickAddOneUser = () => {
        openEditDialog();
        setCurUserData(defaultCurUserData);
    };

    return (
        <div className="actions-container">
            <Paper className="actions__paper">
                <Button variant="contained" onClick={handleClickAddOneUser}>
                    Add one user
                </Button>
                <Typography>输入用户信息 </Typography>
            </Paper>
            <Paper className="actions__paper">
                {/* <label htmlFor="csv-upload">
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
                </label> */}
                <Button variant="contained" onClick={()=>{openUploadListDialog()}}>Add multiple user</Button>

                <Typography>上传用户列表（xsl）</Typography>
            </Paper>
        </div>
    );
};

export default Actions;
