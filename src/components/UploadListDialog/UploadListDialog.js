import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import csv from "csvtojson";
import csv2JSON from "../../utils/csv2JSON";
import csvList2TableUserDataListPipe from "../../utils/csvList2TableUserDataListPipe";
import UserTable from "../Table/UserTable";
import { UserContext } from "../../App";
import defaultCurUserData from "../../mockData/defaultCurUserData";

const UploadListDialog = ({ open, handleClose,onClose }) => {
    const [imageFile, setImageFile] = useState("");
    const [csvFile, setCsvFile] = useState("");
    const [userDataList, setUserDataList] = useState([]);
    const { setHandleSubmitEdit } = useContext(UserContext);

    useEffect(() => {
        setHandleSubmitEdit((serialNum, snapshot) => {
            console.log("serialNum", serialNum);
            setUserDataList((prev) => {
                const targetIndex = prev.findIndex((item) => item.serialNum.content === serialNum);
                console.log("index", targetIndex);
                snapshot = { ...prev[targetIndex], ...snapshot };
                console.log("prev", prev, snapshot, serialNum);
                return [...prev.slice(0, targetIndex), snapshot, ...prev.slice(targetIndex + 1)];
            });
        });
    }, []);

    

    const handleChangeUploadImage = (event) => {
        Array.from(event.target.files).forEach((file) => {
            var reader = new FileReader();
            reader.onload = function (event) {
                console.log("file", event.target.result, file);
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
        console.log("csvLIst", newUserDataList);
        setUserDataList(newUserDataList);
    };
    console.log("udl", userDataList);

    return (
        <Dialog open={open} maxWidth={"1000px"} onClose={onClose}TransitionProps={{
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
                <UserTable userDataList={userDataList} />
            </DialogContent>

            <DialogActions>
                <Button>Submit</Button>
                <Button>Delete</Button>
                <Button>Download</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadListDialog;
