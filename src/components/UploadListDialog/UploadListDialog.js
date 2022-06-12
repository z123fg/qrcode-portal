import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import csv from "csvtojson";
import csv2JSON from "../../utils/csv2JSON";
import csvList2TableUserDataListPipe from "../../utils/csvList2TableUserDataListPipe";
import UserTable from "../Table/UserTable";
import defaultCurUserData from "../../mockData/defaultCurUserData";
import { getSnapshotData } from "../../utils/canvasUtils";
import EditDialog from "../EditDialog/EditDialog";
import curUserData from "../../mockData/curUserData";

const userTableColumns = [
    "serialNum",
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
    const [curUserData, setCurUserData] = useState(defaultCurUserData)

    const handleChangeUploadImage = (event) => {
        Array.from(event.target.files).forEach((file) => {
            var reader = new FileReader();
            reader.onload = function (event) {
                setUserDataList((prev) => {
                    const targetIndex = prev.findIndex(
                        (item) => item.serialNum.content === file.name.split(".")[0]
                    );
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
                const targetIndex = prev.findIndex((item) => item.serialNum.content === curUserData.serialNum.content);
                snapshot = { ...prev[targetIndex], ...snapshot };
                return [...prev.slice(0, targetIndex), snapshot, ...prev.slice(targetIndex + 1)];
            });
    }

    const handleDeleteEdit = () => {
        setUserDataList(prev=>prev.filter(item=>item.serialNum.content === curUserData.serialNum.content));
    }

    const handleDownloadEdit = () => {

    }

    const handleClickEditTableRow = (serialNum) => {
        setCurUserData(userDataList.find(item=>item.serialNum.content === serialNum));
        setIsEditDialogOpen(true)
    }

    const onCloseDialog = () => {

    }


    return (
        <Dialog open={open} maxWidth={"1000px"} onClose={onCloseDialog}TransitionProps={{
            onExited: () => {
                setUserDataList([]);
                
            },
        }}>
            <DialogContent>
                <label htmlFor="csv-upload" style={{ margin: "20px" }}>
                    <input
                        value={csvFile}
                        id="csv-upload"
                        type={"file"}
                        accept={".csv"}
                        style={{ display: "none" }}
                        onChange={handleUploadCSV}
                    />
                    <Button onClick={() => setCsvFile("")} component="span" variant="contained">
                        Upload .csv file
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
                    />
                    <Button onClick={() => setImageFile("")} component="span" variant="contained">
                        Upload Images
                    </Button>
                </label>
                <UserTable userDataList={userDataList} handleClickEditTableRow={handleClickEditTableRow} columns={userTableColumns}/>
            </DialogContent>

            <DialogActions>
                <Button>Submit</Button>
                <Button>Delete</Button>
                <Button>Download</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
            <EditDialog 
                open={isEditDialogOpen}
                curUserData={curUserData}
                handleClose={()=>{
                    setIsEditDialogOpen(false)
                }}
                onClose={()=>{}}
                handleSubmit={handleSubmitEdit}
                handleDelete={handleDeleteEdit}
                handleDownload={handleDownloadEdit}
            />
        </Dialog>
    );
};

export default UploadListDialog;
