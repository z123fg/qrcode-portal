import React, { useEffect, useState } from "react";
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
    downloadCanvasAsImage,
    generateCertWithData,
    getCanvas,
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
        map[v] = k;
    });
    return map;
})();

const TextfieldEntryLabelMap = {
    certType: "Certificate Type",
    name: "Name",
    idNum: "ID Number",
    organization: "Organization",
    certNum: "Certificate Number",
    expDate: "Expiration Date",
    issuingAgency: "Issuing Agency",
};
/* 

*/

const EditDialog = ({ open, handleClose, onClose, handleSubmit, handleDelete, curUserData }) => {
    const [isCanvasReady, setIsCanvasReady] = useState(false);
    const [displayedCurUserData, setDisplayedCurUserData] = useState(curUserData);

    const { certType, profileImage } = displayedCurUserData;
    const [imageFile, setImageFile] = useState("");
    useEffect(() => {
        if (open) {
            setTimeout(async () => {
                initCanvas();
                await loadTemplate(certType.content);
                await generateCertWithData(curUserData);
                console.log("objs2", getCanvas().getObjects());
                getCanvas().setActiveObject(getCanvas().getObjects()[3]);
                setIsCanvasReady(true);
            });
        } else {
            setIsCanvasReady(false);
        }
    }, [curUserData, open, certType.content]);

    useEffect(() => {
        setDisplayedCurUserData(curUserData);
    }, [curUserData]);

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
        handleSubmit?.(snapshot);
        handleClose?.();
    };

    const handleEditDisplayedCurUserData = (e) => {
        setDisplayedCurUserData((prev) => ({
            ...prev,
            [e.target.name]: { ...prev[e.target.name], content: e.target.value },
        }));
    };

    const handleClickClose = () => {
        handleClose?.();
        onClose?.();
    };

    const handleClickDownload = () => {
        downloadCanvasAsImage();
    };

    const handleChangeUploadImage = (event) => {
        var reader = new FileReader();
        reader.onload = function (event) {
            setDisplayedCurUserData((prev) => ({
                ...prev,
                profileImage: { ...prev.profileImage, content: event.target.result },
            }));
        };
        reader.readAsDataURL(event.target.files[0]);
    };
    return (
        <Dialog
            open={open}
            maxWidth={"1000px"}
            className="edit-dialog"
            onClose={() => {
                onClose();
                console.log("onClose");
                handleClickClose();
            }}
            TransitionProps={{
                onExited: () => {
                    destroyCanvas();
                },
            }}
        >
            <DialogTitle>编辑证书信息</DialogTitle>

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
                        上传证件照
                    </Button>
                </label>
                <Canvas />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClickSubmit}>提交</Button>
                {handleDelete && <Button onClick={handleDelete}>删除此证书信息</Button>}
                <Button onClick={handleClickDownload}>下载为图片</Button>
                <Button onClick={handleClickClose}>取消</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;
