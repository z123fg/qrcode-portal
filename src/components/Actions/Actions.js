import React, { useContext, useEffect, useState } from "react";
import { Button, Typography, Paper } from "@mui/material";
import "./Actions.css";
import EditDialog from "../EditDialog/EditDialog";
import defaultCurUserData from "../../mockData/defaultCurUserData";
import UploadListDialog from "../UploadListDialog/UploadListDialog";
import { createSingleUserData } from "../../services/userData";
import { PortalContext } from "../../App";

const Actions = () => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const { refreshGlobalUserDataList } = useContext(PortalContext)
    const [isUploadListDialogOpen, setIsUploadListDialogOpen] = useState(false);
    const [curUserData, setCurUserData] = useState(defaultCurUserData);
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

    const handleClickAddOneUser = () => {
        setIsEditDialogOpen(true)
    };

    const handleDownloadEdit = () => {

    }

    const handleSubmitEdit = (snapshot) => {
        console.log("snapshot", snapshot)
        createSingleUserData(snapshot,refreshGlobalUserDataList);
    }

    const onCloseEditDialog = () => {
        setCurUserData({ ...defaultCurUserData });
    }




    return (
        <div className="actions-container">
            <Paper className="actions__paper">
                <Button variant="contained" onClick={handleClickAddOneUser}>
                    Add one user
                </Button>
                <Typography>输入用户信息 </Typography>
                <EditDialog
                    open={isEditDialogOpen}
                    handleClose={() => setIsEditDialogOpen(false)}
                    onClose={onCloseEditDialog}
                    curUserData={curUserData}
                    handleDelete={null}
                    handleDownload={handleDownloadEdit}
                    handleSubmit={handleSubmitEdit}
                />
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
                <Button variant="contained" onClick={() => { setIsUploadListDialogOpen(true) }}>Add multiple user</Button>

                <Typography>上传用户列表（xsl）</Typography>
                <UploadListDialog open={isUploadListDialogOpen} handleClose={() => setIsUploadListDialogOpen(false)} />

            </Paper>
        </div>
    );
};

export default Actions;
