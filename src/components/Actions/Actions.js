import React, { useState } from "react";
import { Button, Typography, Paper } from "@mui/material";
import "./Actions.css";
import EditDialog from "../EditDialog/EditDialog";
import defaultCurUserData from "../../mockData/defaultCurUserData";
import UploadListDialog from "../UploadListDialog/UploadListDialog";
import useServiceHelper from "../../hooks/useServiceHelper";
import { getCanvas, prepareCertImageForUpload } from "../../utils/canvasUtils";

const Actions = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploadListDialogOpen, setIsUploadListDialogOpen] = useState(false);
  const [curUserData, setCurUserData] = useState(defaultCurUserData);
  const { createSingleUserDataCarefully } = useServiceHelper();

  /* useEffect(() => {
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
    }, []); */

  const handleClickAddOneUser = () => {
    setIsEditDialogOpen(true);
  };

  const handleSubmitEdit = async (snapshot) => {
     prepareCertImageForUpload(snapshot);
    await createSingleUserDataCarefully(snapshot);
  };

  const onCloseEditDialog = () => {};

  return (
    <div className="actions-container">
      <Paper className="actions__paper">
        <Button variant="contained" onClick={handleClickAddOneUser}>
          Add one user
        </Button>
        <Typography>输入单一证书信息 </Typography>
        <EditDialog
          open={isEditDialogOpen}
          handleClose={() => {
            setIsEditDialogOpen(false);
            setCurUserData({ ...defaultCurUserData });
          }}
          onClose={onCloseEditDialog}
          curUserData={curUserData}
          handleDelete={null}
          handleSubmit={handleSubmitEdit}
        />
      </Paper>
      <Paper className="actions__paper">
        <Button
          variant="contained"
          onClick={() => {
            setIsUploadListDialogOpen(true);
          }}
        >
          Add multiple user
        </Button>

        <Typography>上传证书列表（csv）</Typography>
        <UploadListDialog
          open={isUploadListDialogOpen}
          handleClose={() => {
            setIsUploadListDialogOpen(false);
          }}
        />
      </Paper>
    </div>
  );
};

export default Actions;
