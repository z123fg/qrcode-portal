import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import {  generateCertWithData, getCanvas, initCanvas } from "../../utils/canvasUtils";
const Canvas = () => {
    const canvasEl = useRef();
    useEffect(() => {
        initCanvas();
        console.log("public", process.env);
        fabric.Image.fromURL("/1.metallographic-testing(entry)-1.png", (image) => {
            const imageObj = image.set({
                id: "image_" + 1,
                width: image.width,
                height: image.height,
            });
            getCanvas().add(imageObj).renderAll();
            generateCertWithData({name:"yizhou zhou", idNum:"1231331231231", organization:"antra", certNum:"12333123123", expDate:"2022"})
        });
    }, []);
    return (
        <div>
            <canvas id="canvas" ref={canvasEl} />
        </div>
    );
};

export default Canvas;
