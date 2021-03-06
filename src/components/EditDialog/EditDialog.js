import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    DialogActions,
    Input,
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
    getCanvas,
    getSnapshotData,
    initCanvas,
    loadTemplate,
    updateCertEntry,
    updateProfileImage,
} from "../../utils/canvasUtils";
import { UserContext } from "../../App";
import tableUserData2CanvasUserDataPipe from "../../utils/tableUserData2CanvasUserDataPipe";

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
    Object.entries(certTypeMap).forEach(([k,v])=>{
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
};
/* 

*/

const EditDialog = ({ open, handleClose, onClose }) => {
    const context = useContext(UserContext);

    let {
        context: { curUserData, isEditDialogOpen, lastEntry, isCanvasReady, handleSubmitEdit },
        handleEditCurUserData,
        updateCanvasStatus,
    } = context;
    const pickedCurUserData = tableUserData2CanvasUserDataPipe(curUserData);
    const { certType, name, idNum, organization, certNum, expDate, profileImage} = pickedCurUserData;
    const [imageFile, setImageFile] = useState("");
    useEffect(() => {
        if (isEditDialogOpen) {
            setTimeout(async () => {
                initCanvas();
                await loadTemplate(certType.content);
                generateCertWithData(pickedCurUserData);
                updateCanvasStatus(true);
            });
        }
    }, [isEditDialogOpen, certType.content]);

    useEffect(() => {
        if (lastEntry !== null && isCanvasReady) {
            updateCertEntry(lastEntry, pickedCurUserData[lastEntry].content);
        }
    }, [name, idNum, organization, certNum, expDate]);

    useEffect(() => {}, [profileImage]);

    const handleSubmit =() => {
        let snapshot = getSnapshotData();
        handleSubmitEdit(curUserData.serialNum.content,snapshot);
        handleClose();
    }
    const handleChangeUploadImage = (event) => {
        var reader = new FileReader();
        reader.onload = function (event) {
            updateProfileImage(event.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
    };
    return (
        <Dialog
            maxWidth={"1000px"}
            open={open}
            className="edit-dialog"
            onClose={onClose}
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
                        value={pickedCurUserData.certType.content}
                        label={TextfieldEntryLabelMap.certType}
                        name="certType"
                        onChange={handleEditCurUserData}
                    >
                        {Object.entries(certTypeMap).map(([key, value]) => (
                            <MenuItem key={key} value={key}>
                                {value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {Object.entries(pickedCurUserData)
                    .filter(([key, value]) => value.type === "text")
                    .map(([key, value]) => {
                        return (
                            <TextField
                                key={key}
                                style={{ margin: "20px" }}
                                onChange={handleEditCurUserData}
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
                <Button onClick={handleSubmit}>Submit</Button>
                <Button>Delete</Button>
                <Button>Download</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;
