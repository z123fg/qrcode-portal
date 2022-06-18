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
    isCanvasReady,
    loadTemplate,
    updateCanvasStatus,
    updateCertEntry,
    updateProfileImage,
} from "../../utils/canvasUtils";
import OSS from "ali-oss";
import axios from "axios";
import { getStsToken } from "../../services/sts";

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

const token = {
    RequestId: "E7B4319F-9B07-57EF-96C8-C3A8A6DF8874",
    AssumedRoleUser: {
        Arn: "acs:ram::1299153890650559:role/sts-oss/test",
        AssumedRoleId: "373661468221852096:test",
    },
    Credentials: {
        SecurityToken:
            "CAISyQJ1q6Ft5B2yfSjIr5b2MuLMlZwW4qGca0j6hTMge9ZGivDnjTz2IH9PendpBe4WtP42lG1S7vcclq1vRoRZHbNKh3iOtsY5yxioRqackQzcj9Vd+lfMewW6Dxr8w7WdAYHQR8/cffGAck3NkjQJr5LxaTSlWS7CU/iOkoU1VskLeQO6YDFafs80QDFvs8gHL3DcGO+wOxrx+ArqAVFvpxB3hBFDi+u2ydbO7QHF3h+oiL0MvY/2LpXhd852IJ57FM+v2+J3cqeEyC5X9x8ota59l/5D4iyV/IPfUUBL6BKKPq/M9cdzJQs+frI9Fa9Aob3klfpkvauRtfyukUccZLwOA3WHGt34nZaVIo7zaIZlL4ScEm/Wz9WCOqPytw4Zen8BPGtIAYF+cSEuUEByGmuAc//6ogibPB3MULSelaYtyoqidJkxOABFTRqAAaZAItm9C1ktPjF/f2SbJ2AeL3hazZg5QRPVtrat4RDxmCWN5K9aKPg0ezB17LCL0K498XE4VcYi9eGthOlxqu0DAT9pAU7sJD4+7ZOpWWOtjdz3rdjKq9jHWFC1IliQWiF6PBtZtwd+6PlqFLN+34wWVmNEAxx8CKQfgFXpnvFB",
        AccessKeyId: "STS.NUCyXxxC7UcwinKa3uwYje5Lo",
        AccessKeySecret: "4GFaRhUwHYQXYonGY4FsQ49FmpdEcQ8uYAMivRmHJtnu",
        Expiration: "2022-06-16T07:18:28Z",
    },
};
const client = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
    region: "oss-cn-hangzhou",
    // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
    accessKeyId: token.Credentials.AccessKeyId,
    accessKeySecret: token.Credentials.AccessKeySecret,
    // 从STS服务获取的安全令牌（SecurityToken）。
    stsToken: token.Credentials.SecurityToken,
    // 刷新临时访问凭证的时间间隔，单位为毫秒。
    // 填写Bucket名称。
    bucket: "qrcode-portal",
});

async function put(file) {
    try {
        // object表示上传到OSS的文件名称。
        // file表示浏览器中需要上传的文件，支持HTML5 file和Blob类型。
        const r1 = await client.put("profile-photo/object.jpg", file);
        console.log("put success: %j", r1);
        const r2 = await client.get("object");
        console.log("get success: %j", r2);
    } catch (e) {
        console.error("error: %j", e);
    }
}

const EditDialog = ({ open, handleClose, onClose, handleSubmit, handleDelete, curUserData }) => {
    const [displayedCurUserData, setDisplayedCurUserData] = useState(curUserData);
    const [isCanvasRendered, setIsCanvasRendered] = useState(false);
    const { certType, profileImage } = displayedCurUserData;
    const [imageFile, setImageFile] = useState("");
    /* useEffect(() => {
    setTimeout(async () => {
      if (open && isCanvasReady) {
        console.log("displayedCurUserData", displayedCurUserData.name.content);
        updateCanvasStatus(false);
        initCanvas();
        await loadTemplate(certType.content);
        await generateCertWithData(displayedCurUserData);
        updateCanvasStatus(true);
      }
    });
  }, [open, certType.content, displayedCurUserData]); */

    useEffect(() => {
        setDisplayedCurUserData(curUserData);
    }, [curUserData]);

    useEffect(() => {
        (async () => {
            if (isCanvasRendered) {
                setIsCanvasRendered(true);
                updateCanvasStatus(false);
                initCanvas();
                await loadTemplate(certType.content);
                await generateCertWithData(curUserData);
                updateCanvasStatus(true);
            }
        })();
    }, [isCanvasRendered]);

    useEffect(() => {
        if (open && isCanvasRendered && isCanvasReady) {
          
            loadTemplate(displayedCurUserData.certType.content);
        }
    }, [displayedCurUserData.certType.content]);

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

    const handleClickSubmit = () => {
        let snapshot = getSnapshotData(certType.content);
        snapshot = { ...snapshot, ...displayedCurUserData };
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
                    .filter(([key, value]) => TextfieldEntryLabelMap[key])
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
                {handleDelete && <Button onClick={handleDelete}>删除</Button>}
                <Button onClick={handleClickDownload}>下载为图片</Button>
                <Button onClick={handleClickClose}>取消</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;
