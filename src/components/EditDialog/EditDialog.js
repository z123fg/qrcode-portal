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

const EditDialog = ({
  open,
  handleClose,
  onClose,
  handleSubmit,
  handleDelete,
  curUserData,
}) => {
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
        console.log("lt")
        await loadTemplate(certType.content);
        await generateCertWithData(curUserData);
        updateCanvasStatus(true);
      }
    })();
  }, [isCanvasRendered]);

  useEffect(() => {
    if (open && isCanvasRendered&&isCanvasReady) {
      console.log("certType")
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
    snapshot = {...snapshot,...displayedCurUserData};
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
    console.log("clickclose")
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
          <InputLabel id="demo-simple-select-label">
            {TextfieldEntryLabelMap.certType}
          </InputLabel>
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
