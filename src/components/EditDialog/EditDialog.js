import React, { useContext, useEffect, useState } from "react";
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
    Link,
} from "@mui/material";
import "./EditDialog.css";
import Canvas from "../Canvas/Canvas";
import {
    destroyCanvas,
    downloadCanvasAsImage,
    generateCertWithData,
    getCanvas,
    getQRCodeLink,
    getSnapshotData,
    initCanvas,
    isCanvasReady,
    loadTemplate,
    updateCanvasStatus,
    updateCertEntry,
    updateProfileImage,
    updateQRCode,
} from "../../utils/canvasUtils";
import { PortalContext } from "../../App";
import intl from "../../intl/intl";

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

const inputEntryList = ["name", "idNum", "organization", "certNum", "expDate", "issuingAgency"];

const EditDialog = ({ open, handleClose, onClose, handleSubmit, handleDelete, curUserData, isGlobal }) => {
    const [displayedCurUserData, setDisplayedCurUserData] = useState(curUserData);
    const [isCanvasRendered, setIsCanvasRendered] = useState(false);
    const { certType, profileImage } = displayedCurUserData;
    const [imageFile, setImageFile] = useState("");
    const [isError, setIsError] = useState(false);
    const { showBackdrop } = useContext(PortalContext);
    useEffect(() => {
        setDisplayedCurUserData(curUserData);
    }, [curUserData]);

    useEffect(() => {
        (async () => {
            if (isCanvasRendered) {
                showBackdrop(true);
                setIsCanvasRendered(true);
                updateCanvasStatus(false);
                initCanvas();
                await loadTemplate(curUserData.certType.content);
                await generateCertWithData(curUserData);
                await generateQRCode(curUserData);
                updateCanvasStatus(true);
                showBackdrop(false);
            }
        })();
    }, [isCanvasRendered]);

    useEffect(() => {
        if (open && isCanvasRendered && isCanvasReady) {
            loadTemplate(displayedCurUserData.certType.content);
        }
    }, [displayedCurUserData.certType.content]);

    useEffect(() => {
        if (open && isCanvasRendered && isCanvasReady) {
            generateQRCode(displayedCurUserData);
        }
    }, [displayedCurUserData.certNum.content, displayedCurUserData.idNum.content]);

    useEffect(() => {
        if (isCanvasReady && getCanvas()) {
            updateCertEntry(displayedCurUserData);
        }
    }, [displayedCurUserData]);

    useEffect(() => {
        if (isCanvasReady && getCanvas()) {
            updateProfileImage(profileImage.content);
        }
    }, [profileImage.content]);

    const handleClickSubmit = async () => {
        if (!validateFields(displayedCurUserData)) {
            alert("必须填写身份证号和证书编号");
            setIsError(true);
            return;
        }
        let snapshot = getSnapshotData();
        snapshot = { ...displayedCurUserData, ...snapshot };
        await handleSubmit?.(snapshot);
        handleClose?.();
    };

    const generateQRCode = async (userData) => {
        if (!validateFields(userData)) {
            return;
        }
        try {
            await updateQRCode(userData);
        } catch (err) {
            alert(`更新二维码失败，这里是原因：${err}`);
        }
    };

    const handleClickPreviewCertInquiry = () => {
        if (!validateFields(displayedCurUserData)) {
            alert("必须填写身份证号和证书编号");
            setIsError(true);
            return;
        }
        window.open(getQRCodeLink(displayedCurUserData), "_blank");
    };

    const validateFields = (userData) => {
        if (
            userData.certNum.content.length <= 0 ||
            userData.idNum.content.length <= 0 
        ) {
            return false;
        }
        return true;
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
                handleClickClose();
            }}
            TransitionProps={{
                onExited: () => {
                    setIsCanvasRendered(false);
                    destroyCanvas();
                },
                onEntering: () => {
                    setIsCanvasRendered(true);
                },
            }}
        >
            <DialogTitle>编辑证书信息</DialogTitle>
            <DialogContent className="edit-dialog_form">
                <FormControl style={{ margin: "20px" }}>
                    <InputLabel id="demo-simple-select-label">{intl.certType}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={displayedCurUserData.certType.content}
                        label={intl.certType}
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
                {inputEntryList
                    .map((key) => [key, displayedCurUserData[key]])
                    .map(([key, value]) => {
                        const isValidating = key === "certNum" || key === "idNum";
                        return (
                            <TextField
                                multiline
                                error={isValidating && value.content.length <= 0 && isError}
                                helperText={
                                    isValidating && value.content.length <= 0 && isError && "此项不能为空"
                                }
                                key={key}
                                style={{ margin: "20px" }}
                                onChange={handleEditDisplayedCurUserData}
                                name={key}
                                label={intl[key]}
                                variant="outlined"
                                value={value.content}
                                required={isValidating}
                            />
                        );
                    })}
                <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
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
                    {isGlobal === true && (
                        <Button variant="outlined" onClick={handleClickPreviewCertInquiry}>
                            点此预览二维码证书查询结果
                        </Button>
                    )}
                </div>

                <Canvas />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClickSubmit}>提交</Button>
                {handleDelete && <Button onClick={handleDelete}>删除</Button>}
                <Button onClick={handleClickDownload}>下载为图片</Button>
                <Button onClick={handleClickClose}>取消</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;
