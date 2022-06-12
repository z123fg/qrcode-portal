import React, {useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    DialogActions,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import "./EditDialog.css";
import Canvas from "../Canvas/Canvas";
import {
    destroyCanvas,
    generateCertWithData,
    getSnapshotData,
    initCanvas,
    loadTemplate,
    updateCertEntry,
    updateProfileImage,
} from "../../utils/canvasUtils";

export const certTypeMap = {
    MAAM: "光谱分析（A类）中级人员",
    MAAS: "光谱分析（A类）高级人员",
    MABM: "光谱分析（B类）中级人员",
    MPE: "力学性能试验初级人员",
    MPM: "力学性能试验中级人员",
    MPS: "力学性能试验高级人员",
    MTE: "金相检验初级人员",
    MTM: "金相检验中级人员",
    MTS: "金相检验高级人员",
};
export const invCertTypeMap = (() => {
    const map = {};
    Object.entries(certTypeMap).forEach(([k, v]) => {
        map[v] = k
    })
    return map
})()

const TextfieldEntryLabelMap = {
    certType: "Certificate Type",
    name: "Name",
    idNum: "ID Number",
    organization: "Organization",
    certNum: "Certificate Number",
    expDate: "Expiration Date",
    issuingAgency: "Issuing Agency"
};
/* 

*/

const EditDialog = ({ open, handleClose, onClose, handleSubmit, handleDelete, handleDownload, curUserData }) => {

    const [isCanvasReady, setIsCanvasReady] = useState(false);
    const [displayedCurUserData, setDisplayedCurUserData] = useState(curUserData);

    const { certType, profileImage } = displayedCurUserData;
    const [imageFile, setImageFile] = useState("");
    useEffect(() => {
        if (open) {
            setTimeout(async () => {
                initCanvas();
                await loadTemplate(certType.content);
                generateCertWithData(curUserData);
                setIsCanvasReady(true);
            });
        }
    }, [curUserData, open, certType.content]);

    useEffect(() => {
        setDisplayedCurUserData(curUserData)
    }, [curUserData])

    useEffect(() => {
        if (isCanvasReady) {
            updateCertEntry(displayedCurUserData);
        }
    }, [displayedCurUserData]);

    useEffect(() => {
        if (isCanvasReady) {
            updateProfileImage(profileImage.content);
        }
    }, [profileImage.content]);

    const handleClickSubmit = () => {
        let snapshot = getSnapshotData(certType.content);
        handleSubmit(snapshot);
        handleClose();
    }

    const handleClickDelete = () => {
        handleDelete();
        handleDelete()
    }

    const handleEditDisplayedCurUserData = (e) => {
        setDisplayedCurUserData(prev => ({
            ...prev,
            [e.target.name]: { ...prev[e.target.name], content: e.target.value },
        }))
    }

    const handleClickClose = () => {
        setIsCanvasReady(false)
        handleClose();
        onClose();
    }

    const handleClickDownload = () => {
        handleDownload();
    }

    const handleChangeUploadImage = (event) => {
        var reader = new FileReader();
        reader.onload = function (event) {

            setDisplayedCurUserData(prev => ({ ...prev, profileImage: { ...prev.profileImage, content: event.target.result } }))

        };
        reader.readAsDataURL(event.target.files[0]);
    };
    return (
        <Dialog
            maxWidth={"1000px"}
            open={open}
            className="edit-dialog"
            onClose={() => {
                onClose();

                handleClickClose()
            }}
            TransitionProps={{
                onExited: () => {
                    destroyCanvas();

                },
            }}
        >
            <DialogTitle>Add New User</DialogTitle>

            <DialogContent className="edit-dialog_form">
                <FormControl style={{ margin: "20px" }}>
                    <InputLabel id="demo-simple-select-label">{TextfieldEntryLabelMap.certType}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={displayedCurUserData.certType.content}
                        label={TextfieldEntryLabelMap.certType}
                        name="certType"
                        onChange={handleEditDisplayedCurUserData}
                    >
                        {Object.entries(certTypeMap).map(([key, value]) => (
                            <MenuItem key={key} value={key}>
                                {value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {Object.entries(displayedCurUserData)
                    .filter(([key, value]) => value.type === "text")
                    .map(([key, value]) => {
                        return (
                            <TextField
                                key={key}
                                style={{ margin: "20px" }}
                                onChange={handleEditDisplayedCurUserData}
                                name={key}
                                label={TextfieldEntryLabelMap[key]}
                                variant="outlined"
                                value={value.content}
                            />
                        );
                    })}

                <label htmlFor="contained-button-file">
                    <input
                        onChange={handleChangeUploadImage}
                        style={{ display: "none" }}
                        accept="image/*"
                        id="contained-button-file"
                        type="file"
                        value={imageFile}
                    />
                    <Button
                        variant="contained"
                        component="span"
                        onClick={() => {
                            setImageFile("");
                        }}
                    >
                        Upload
                    </Button>
                </label>
                <Canvas />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClickSubmit}>Submit</Button>
                <Button onClick={handleClickDelete}>Delete</Button>
                <Button onClick={handleClickDownload}>Download</Button>
                <Button onClick={handleClickClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;
