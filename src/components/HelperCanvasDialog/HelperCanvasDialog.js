import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Typography,
    LinearProgress,
} from "@mui/material";
import "./HelperCanvasDialog.css";
import Canvas from "../Canvas/Canvas";
import { destroyCanvas, downloadMultipleCanvasImagesAsZip } from "../../utils/canvasUtils";
import { Box } from "@mui/system";

const HelperCanvasDialog = ({ open, handleClose, onClose, userDataList }) => {
    const [isPending, setIsPending] = useState(false);
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if (open && !isPending) {
            setTimeout(async () => {
                setIsPending(true);
                await downloadMultipleCanvasImagesAsZip(userDataList, setProgress);
                setIsPending(false);
                handleClose();
            });
        }
    }, [userDataList, open]);
    useEffect(()=>{
        if(!open){
            setProgress(0);
            setIsPending(false);
        }
    },[open])

    const handleClickClose = () => {
        handleClose();
        onClose();
    };

    return (
        <Dialog
            sx={{ zIndex: 9998 }}
            maxWidth={"1000px"}
            open={open}
            className="helper-canvas-dialog"
            onClose={() => {
            }}
            TransitionProps={{
                onExited: () => {
                    destroyCanvas();
                },
            }}
        >
            <DialogTitle>Add New User</DialogTitle>

            <DialogContent className="helper-canvas-dialog__form">
                <div style={{ display: "none" }}>
                    <Canvas />
                </div>
                <Box sx={{ display: "flex", alignItems: "center", width:"100%" }}>
                    <Box sx={{ width: "100%", mr: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={(progress / userDataList.length) * 100}
                        />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">{`${Math.round(
                           (progress / userDataList.length) * 100
                        )}%`}</Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default HelperCanvasDialog;
