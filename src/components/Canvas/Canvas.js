import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import {  generateCertWithData, getCanvas, initCanvas } from "../../utils/canvasUtils";
const Canvas = () => {
    useEffect(() => {
        initCanvas();
        
    }, []);
    return (
        <div>
            <canvas style={{zIndex:999}} id="main-canvas" ></canvas>
        </div>
    );
};

export default Canvas;
