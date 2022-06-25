import { Dialog, DialogContent, DialogTitle, LinearProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Canvas from "../Canvas/Canvas";


const LinearProgressDialog = ({progress, title, open}) => {
    return (
        <Dialog
        sx={{ zIndex: 9998 }}
        maxWidth={"1000px"}
        open={open}
        className="helper-canvas-dialog"
        onClose={() => {}}
        
    >
        <DialogTitle>{title}</DialogTitle>

        <DialogContent className="helper-canvas-dialog__form">
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                    />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${progress}%`}</Typography>
                </Box>
            </Box>
        </DialogContent>
    </Dialog>
    )
}

export default LinearProgressDialog;