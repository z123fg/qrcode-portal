import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, Typography, LinearProgress } from "@mui/material";
import "./HelperCanvasDialog.css";
import Canvas from "../Canvas/Canvas";
import { destroyCanvas, downloadMultipleCanvasImagesAsZip } from "../../utils/canvasUtils";
import { Box } from "@mui/system";

const HelperCanvasDialog = ({ start, stop, onStop, userDataList, helperCanvasCallback }) => {
    const [isPending, setIsPending] = useState(false);
    useEffect(() => {
        if (start && !isPending) {
            (async () => {
                setIsPending(true);
                await helperCanvasCallback();
                setIsPending(false);
                handleStop();
            })();
        }
    }, [start]);
    useEffect(() => {
        if (!start) {
            setIsPending(false);
        }
    }, [start]);

    const handleStop = () => {
        stop()
        onStop();
    };

    return (
        <div style={{ display: "none" }}>
            {start&&<Canvas />}
        </div>
    );
};

export default HelperCanvasDialog;
