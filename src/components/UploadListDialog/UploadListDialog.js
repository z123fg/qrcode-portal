import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import csv2JSON from "../../utils/csv2JSON";
import csvList2TableUserDataListPipe from "../../utils/csvList2TableUserDataListPipe";
import UserTable from "../Table/UserTable";
import defaultCurUserData from "../../mockData/defaultCurUserData";
import EditDialog from "../EditDialog/EditDialog";
import RefreshIcon from "@mui/icons-material/Refresh";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import "./UploadListDialog.css";
import HelperCanvasDialog from "../HelperCanvasDialog/HelperCanvasDialog";
import useServiceHelper from "../../hooks/useServiceHelper";
const userTableColumns = [
    "_id",
    "name",
    "idNum",
    "organization",
    "certNum",
    "expDate",
    "issuingAgency",
    "hasProfileImage",
    "certType",
];

const UploadListDialog = ({ open, handleClose }) => {
    const [imageFile, setImageFile] = useState("");
    const [csvFile, setCsvFile] = useState("");
    const [userDataList, setUserDataList] = useState([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [curUserData, setCurUserData] = useState(defaultCurUserData);
    const [isHelperCanvasDialogOpen, setIsHelperCanvasDialogOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const { createUserDataListCarefully } = useServiceHelper();


    const handleInputKeyword = (e) => {
        setKeyword(e.target.value);
    };
    const generateFilteredList = () => {
        const displayedList = userDataList.map((item) => ({
            ...item,
            hasProfileImage: {
                content:
                    item?.profileImage?.content?.length || "" > 10 ? (
                        <CheckIcon sx={{ color: "green" }} />
                    ) : (
                        <CloseIcon sx={{ color: "red" }} />
                    ),
            },
        }));
        if (keyword === "") return displayedList;
        return displayedList.filter((row) =>
            Object.values(row).some((entry) => (entry.content + "").includes(keyword))
        );
    };

    const handleChangeUploadImage = (event) => {
        Array.from(event.target.files).forEach((file) => {
            var reader = new FileReader();
            reader.onload = function (event) {
                setUserDataList((prev) => {
                    const targetIndex = prev.findIndex((item) => item._id === file.name.split(".")[0]);
                    return [
                        ...prev.slice(0, targetIndex),
                        {
                            ...prev[targetIndex],
                            profileImage: {
                                ...prev[targetIndex].profileImage,
                                ...defaultCurUserData.profileImage,
                                content: event.target.result,
                            },
                        },
                        ...prev.slice(targetIndex + 1),
                    ];
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const handleUploadCSV = async (e) => {
        const csvList = await csv2JSON(e.target.files[0]);
        const newUserDataList = csvList2TableUserDataListPipe(csvList);
        setUserDataList(newUserDataList);
    };

    const handleSubmitEdit = (snapshot) => {
        setUserDataList((prev) => {
            const targetIndex = prev.findIndex((item) => item._id === curUserData._id);
            snapshot = { ...prev[targetIndex], ...snapshot };
            return [...prev.slice(0, targetIndex), snapshot, ...prev.slice(targetIndex + 1)];
        });
    };

    const handleDeleteEdit = () => {
        setUserDataList((prev) => prev.filter((item) => item._id !== curUserData._id));
        setIsEditDialogOpen(false);
    };

    const handleClickEditTableRow = (id) => {
        setCurUserData(userDataList.find((item) => item._id === id));
        setIsEditDialogOpen(true);
    };

    const onCloseDialog = () => {};

    const handleClickDownloadZip = () => {
        setIsHelperCanvasDialogOpen(true);
    };

    const handleClickSubmitList = () => {
        createUserDataListCarefully(userDataList, handleClose());
    }
    console.log("udl", userDataList);

    return (
        <Dialog
            open={open}
            maxWidth={"1000px"}
            onClose={onCloseDialog}
            TransitionProps={{
                onExited: () => {
                    setUserDataList([]);
                },
            }}
        >
            <DialogContent className="dialog-content">
                <div className="upload-buttons__container">
                    <label htmlFor="csv-upload">
                        <input
                            value={csvFile}
                            id="csv-upload"
                            type={"file"}
                            accept={".csv"}
                            style={{ display: "none" }}
                            onChange={handleUploadCSV}
                        />
                        <Button onClick={() => setCsvFile("")} component="span" variant="contained">
                            先上传 .csv 文件
                        </Button>
                    </label>
                    <label htmlFor="image-upload" style={{ margin: "20px" }}>
                        <input
                            value={imageFile}
                            id="image-upload"
                            type={"file"}
                            multiple
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleChangeUploadImage}
                            disabled={userDataList.length <= 0}
                        />
                        <Button
                            onClick={() => setImageFile("")}
                            disabled={userDataList.length <= 0}
                            component="span"
                            variant="contained"
                        >
                            再上传证件照（多个）
                        </Button>
                    </label>
                </div>

                {userDataList.length > 0 ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "start",
                            width: "100%",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        <div style={{ display: "flex", gap: "10px" }}>
                            <TextField
                                label="Search"
                                variant="outlined"
                                onChange={handleInputKeyword}
                                value={keyword}
                                size="small"
                            />
                            <IconButton>
                                <RefreshIcon />
                            </IconButton>
                        </div>
                        <UserTable
                            userDataList={generateFilteredList()}
                            handleClickEditTableRow={handleClickEditTableRow}
                            columns={userTableColumns}
                        />
                    </div>
                ) : (
                    <div>
                        <Typography>没有找到证书信息</Typography>
                    </div>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClickSubmitList}>上传全部数据</Button>
                <Button onClick={handleClickDownloadZip}>下载为zip压缩包</Button>
                <Button onClick={handleClose}>取消</Button>
            </DialogActions>
            <EditDialog
                open={isEditDialogOpen}
                curUserData={curUserData}
                handleClose={() => {
                    setIsEditDialogOpen(false);
                }}
                onClose={() => {}}
                handleSubmit={handleSubmitEdit}
                handleDelete={handleDeleteEdit}
            />
            <HelperCanvasDialog
                open={isHelperCanvasDialogOpen}
                handleClose={() => {
                    setIsHelperCanvasDialogOpen(false);
                }}
                onClose={() => {}}
                userDataList={userDataList}
            />
            {/* <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.Dialog + 1 }}
                open={getIsDownloadZipInProgress()}
            >
                <CircularProgress color="inherit" />
            </Backdrop> */}
        </Dialog>
    );
};

export default UploadListDialog;
