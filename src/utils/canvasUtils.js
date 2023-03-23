import { fabric } from "fabric";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import QRCode from "qrcode";
import dataURL2Blob from "./dataURL2Blob";
import { takeLast4Digits } from "./takeLast4Digits";

export const defaultImageLeft = 1850
export const defaultImageTop = 1940;
/* 
name: { type: "text", content: "", left: 700, top: 1150, scaleX: 1, scaleY: 1, angle: 0 },
    idNum: { type: "text", content: "", left: 700, top: 1270, scaleX: 1, scaleY: 1, angle: 0 },
    organization: { type: "text", content: "", left: 700, top: 1375, scaleX: 1, scaleY: 1, angle: 0 },
    certNum: { type: "text", content: "", left: 700, top: 1480, scaleX: 1, scaleY: 1, angle: 0 },
    expDate: { type: "text", content: "", left: 500, top: 1600, scaleX: 1, scaleY: 1, angle: 0 },
    profileImage: { type: "image", content: "", left: defaultImageLeft, top: defaultImageTop, scaleX: 1, scaleY: 1, angle: 0 },

*/

const defaultImageProps = {
    padding: 10,
    cornersize: 1,
    selectable: true,
    hasControls: true,
    cornerStrokeColor: "#CD5C5C",
    borderColor: "#4169E1",
    transparentCorners: false,
    cornerColor: "#A52A2A",
    originX: "center",
    originY: "center",
    left: defaultImageLeft,
    top: defaultImageTop,
    entry: "profileImage",
};

const defaultTextProps = {
    name: {
        cornerStrokeColor: "#CD5C5C",
        borderColor: "#4169E1",
        cornerColor: "#A52A2A",
        transparentCorners: false,
        padding: 10,
        cornersize: 1,
        left: 1175,
        top: 1765,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        entry: "name",
        fontSize: 60,
        fontFamily: "Simsun",
        originX: "center",
        originY: "center",
        fontWeight: 650,
        textAlign: "center",
        centeredScaling: true,
        lineHeight:0.85
    },
    idNum: {
        cornerStrokeColor: "#CD5C5C",
        borderColor: "#4169E1",
        cornerColor: "#A52A2A",
        transparentCorners: false,
        padding: 10,
        cornersize: 1,
        left: 1175,
        top: 1942,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        entry: "idNum",
        fontSize: 60,
        fontFamily: "Simsun",
        originX: "center",
        originY: "center",
        fontWeight: 650,
        textAlign: "center",
        centeredScaling: true,
        lineHeight:0.85
    },
    organization: {
        cornerStrokeColor: "#CD5C5C",
        borderColor: "#4169E1",
        cornerColor: "#A52A2A",
        transparentCorners: false,
        padding: 10,
        cornersize: 1,
        left: 1175,
        top: 2100,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        entry: "organization",
        fontSize: 60,
        fontFamily: "Simsun",
        originX: "center",
        originY: "center",
        fontWeight: 650,
        textAlign: "center",
        centeredScaling: true,
        lineHeight:0.85
    },
    certNum: {
        cornerStrokeColor: "#CD5C5C",
        borderColor: "#4169E1",
        cornerColor: "#A52A2A",
        transparentCorners: false,
        padding: 10,
        cornersize: 1,
        left: 1175,
        top: 2265,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        entry: "certNum",
        fontSize: 60,
        fontFamily: "Simsun",
        originX: "center",
        originY: "center",
        fontWeight: 650,
        textAlign: "center",
        centeredScaling: true,
        lineHeight:0.85
    },
    expDate: {
        cornerStrokeColor: "#CD5C5C",
        borderColor: "#4169E1",
        cornerColor: "#A52A2A",
        transparentCorners: false,
        padding: 10,
        cornersize: 1,
        left: 819,
        top: 2435,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        entry: "expDate",
        fontSize: 60,
        fontFamily: "Simsun",
        originX: "center",
        originY: "center",
        fontWeight: 650,
        textAlign: "center",
        centeredScaling: true,
        lineHeight:0.85
    },
};

const ZOOM_LEVEL = 0.4;

export let isCanvasReady = true;

export const updateCanvasStatus = (status) => (isCanvasReady = status);

fabric.Canvas.prototype.getObjsByProp = function (...rest) {
    return this.getObjects().filter((obj) => {
        return rest.every((kv) => {
            return obj[Object.keys(kv)[0]] === Object.values(kv)[0];
        });
    });
};
let canvas = null;
export const getCanvas = () => canvas;
export const initCanvas = () => {
    destroyCanvas();
    const originalWidth = 2481;
    const originalHeight = 3509;
    canvas = new fabric.Canvas("main-canvas", {
        preserveObjectStacking: true,
        stateful: true,
        centeredRotation: false,
        selectionKey: "ctrlKey",
        controlsAboveOverlay: true,
    });
 /*    canvas.on("object:moving", function (e) {
        console.log("move", e.target.left, e.target.top, e.target.width, e.target.getScaledWidth(),e.target.getScaledHeight());
    }); */
    canvas.setZoom(ZOOM_LEVEL);
    canvas.setWidth(originalWidth * canvas.getZoom());
    canvas.setHeight(originalHeight * canvas.getZoom());
    canvas.renderAll();
};

export const destroyCanvas = () => {
    canvas?.dispose();
    canvas = null;
};

export const loadTemplate = async (type) => {
    await new Promise((resolve) => {
        fabric.Image.fromURL(`/${type}.png`, (image) => {
            const imageObj = image.set({
                id: "image_" + 1,
                width: image.width,
                height: image.height,
                selectable: false,
                hasControl: false,
                lockMovementY: true,
                lockMovementX: true,
                entry: "template",
            });
            const oldTemplateObjs = canvas.getObjsByProp({ entry: "template" });

            oldTemplateObjs.forEach((obj) => {
                canvas.remove(obj).renderAll();
            });
            canvas.add(imageObj).sendToBack(imageObj).renderAll();
            resolve();
        });
    });
};

export const updateCertEntry = (curUserData) => {
    Object.entries(curUserData).forEach(([key, value]) => {
        const targetObj = canvas.getObjsByProp({ entry: key })[0];
        if (targetObj?.type === "text" && targetObj.text !== value?.content) {
            let textValue = value.content;
            if (key === "expDate") {
                textValue = new Date(textValue).getFullYear().toString();
            }
            targetObj.set({ text: textValue, content:value.content });
            adjustEntrySize(targetObj);

            canvas.renderAll();
        }
    });
};
export const updateProfileImage = async (imgObj) => {
    const oldImageObj = canvas.getObjsByProp({ entry: "profileImage" })[0];
    if (oldImageObj !== undefined) {
        canvas.remove(oldImageObj);
    }
    fabric.Image.fromURL(imgObj, (image) => {
        image.set({
            ...defaultImageProps,
        });
        image.scaleToHeight(410);

        canvas.add(image).renderAll();
    });
};

export const downloadCanvasAsImage = () => {
    const url = canvas?.toDataURL({
        format: "png",
        enableRetinaScaling: true,
        multiplier: 1 / ZOOM_LEVEL,
        quality: 1,
    });
    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    downloadURI(url, "certicate.png");
};

/* export const downloadMultipleCanvasImagesAsZip = async () => {
    let zip = new JSZip();
    for (let { filename, url } of imageURLsForZip) {
        const blob = await fetch(url).then((res) => res.blob());
        zip.file(`${filename}.png`, blob);
    }
    zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "example.zip");
    });
}; */

export const downloadMultipleCanvasImagesAsZip = async (userDataList, setLinearProgressProps) => {
    setLinearProgressProps({ open: true, progress: 0, title: "正在打包证书图片..." });
    let zip = new JSZip();
    for (let i = 0; i < userDataList.length; i++) {
        const userData = userDataList[i];
        initCanvas();
        await loadTemplate(userData.certType.content);
        await generateCertWithData(userData);
        await updateQRCode(userData);
        const url = canvas?.toDataURL({
            format: "png",
            enableRetinaScaling: true,
            multiplier: 1 / ZOOM_LEVEL,
        });
        const blob = await fetch(url).then((res) => res.blob());
        zip.file(`${userData._id}.png`, blob);
        setLinearProgressProps((prev) => ({
            ...prev,
            progress: Math.round((i / userDataList.length) * 100),
        }));
    }

    await zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "certificates.zip");
    });
    setLinearProgressProps({ open: false, progress: null, title: null });
};

export const prepareCertImageForUpload = (userData) => {
    const url = canvas?.toDataURL({
        format: "png",
        enableRetinaScaling: true,
        multiplier: 1 / ZOOM_LEVEL,
        quality: 1,
    });
    /* const fileObj = dataURL2Blob(url);
        fileList.push({...fileObj, }) */
    userData.certImage = { isSprite: false, content: url, type: "image" };
};

export const prepareMultipleCertImageForUpload = async (userDataList, setLinearProgressProps) => {
    setLinearProgressProps({ open: true, progress: 0, title: "正在生成证书图片..." });
    for (let i = 0; i < userDataList.length; i++) {
        let userData = userDataList[i];
        initCanvas();
        await loadTemplate(userData.certType.content);
        await generateCertWithData(userData);
        await updateQRCode(userData);
        userDataList[i] = { ...userData, ...getSnapshotData() };
        const url = canvas?.toDataURL({
            format: "png",
            enableRetinaScaling: true,
            multiplier: 1 / ZOOM_LEVEL,
            quality: 1,
        });

        userDataList[i].certImage = { isSprite: false, content: url, type: "image" };
        setLinearProgressProps((prev) => ({
            ...prev,
            progress: Math.round((i / userDataList.length) * 100),
        }));
    }
    setLinearProgressProps({ open: false, progress: null, title: null });
};

export const updateQRCode = async (userData) => {
    const QRCodeLink = getQRCodeLink(userData);
    const QRCodeDataURL = await QRCode.toDataURL(QRCodeLink, { quality: 1 });
    await new Promise((resolve, reject) => {
        fabric.Image.fromURL(QRCodeDataURL, (image) => {
            canvas.getObjsByProp({ entry: "qrcode" }).forEach((obj) => {
                canvas.remove(obj);
            });

            image.set({
                entry: "qrcode",
                originX: "center",
                originY: "center",
                left: 740,
                top: 2743,
                cornerStrokeColor: "#CD5C5C",
                borderColor: "#4169E1",
                transparentCorners: false,
                cornerColor: "#A52A2A",
            });
            image.scaleToWidth(300);
            canvas.add(image);
            canvas.bringToFront(image);
            canvas.renderAll();
            resolve();
        });
    });
};

export const getQRCodeLink = (userData) => {
    return `${process.env.REACT_APP_CERT_INQUIRY_ADDRESS}/${takeLast4Digits(userData.idNum.content)}-${
        userData.certNum.content
    }`;
};

const adjustEntrySize = (obj) => {
    if (obj.entry === "expDate") return;
    if (obj.width < 450) {
        obj.set({ originX: "center" });
        obj.set({ left: 1175 });
        obj.set({ scaleX: 1 });
        obj.set({ top: defaultTextProps[obj.entry].top });
    } else if (obj.width >= 450 && obj.width < 622) {
        obj.set({ originX: "left" });
        obj.set({ left: 957 });
        obj.set({ top: defaultTextProps[obj.entry].top });
        //obj.set({scaleX:622/obj.width})
    } else if (obj.width >= 622 && obj.width < 1244) {
        obj.set({ originX: "left" });
        obj.set({ left: 957 });
        obj.set({ scaleX: 622 / obj.width });
        obj.set({ top: defaultTextProps[obj.entry].top });
    } else {
        obj.set({
            text:
                obj.text.slice(0, Math.round(obj.text.length / 2)) +
                "\n" +
                obj.text.slice(Math.round(obj.text.length / 2)),
            top: defaultTextProps[obj.entry].top - 16,
        });
        obj.set({ originX: "left" });
        obj.set({ left: 957 });
        obj.set({ scaleX: 622 / obj.width });
    }
    /* if (obj.width > 1700) {
        obj.set({
            text:
                obj.text.slice(0, Math.round(obj.text.length / 2)) +
                "\n" +
                obj.text.slice(Math.round(obj.text.length / 2)),
            top: defaultTextProps[obj.entry].top - 50,
        });
        obj.set({ scaleX: 850 / obj.width });
    } else {
        if (obj.width > 630) {
            obj.set({ originX: "left", left: 980, top: defaultTextProps[obj.entry].top, scaleX: 1 });
        }
        if (obj.width > 1000) obj.set({ scaleX: 850 / obj.width, top: defaultTextProps[obj.entry].top });
    } */
};

export const generateCertWithData = async (rowData) => {
    return new Promise((resolve1) => {
        const spriteDataList = Object.entries(rowData)
            .filter(([key, value]) => value.isSprite)
            .map(([key, value]) => ({ entry: key, ...value }));
        spriteDataList
            .filter((item) => item.type === "text")
            .forEach((item) => {
                let textValue = item.content;
                if (item.entry === "expDate") textValue = new Date(textValue).getFullYear().toString();
                const obj = new fabric.Text(textValue, {
                    ...defaultTextProps[item.entry],
                    left: +item.left,
                    top: +item.top,
                    entry: item.entry,
                    angle: +item.angle,
                    scaleX: +item.scaleX,
                    scaleY: +item.scaleY,
                    originX: item.originX,
                    content:item.content

                });

                adjustEntrySize(obj);

                canvas.add(obj);
                canvas.bringToFront(obj);
                canvas.renderAll();
            });

        Promise.all(
            spriteDataList
                .filter((item) => item.type === "image")
                .map((item) => {
                    return new Promise((resolve) => {
                        fabric.Image.fromURL(
                            item.content,
                            (image) => {
                                image.set({
                                    ...defaultImageProps,
                                    left: +item.left,
                                    top: +item.top,
                                    entry: item.entry,
                                    angle: +item.angle,
                                    scaleX: +item.scaleX,
                                    scaleY: +item.scaleY,
                                });

                                if (item.content.slice(0, 5) === "data:") {
                                    image.scaleToHeight(410);
                                }
                                canvas.add(image);
                                canvas.bringToFront(image);
                                canvas.renderAll();
                                resolve();
                            },
                            { crossOrigin: "anonymous" }
                        );
                    });
                })
        ).then(() => {
            resolve1();
        });
    });
};

export const getSnapshotData = () => {
    const snapshotData = {};
    canvas
        .getObjects()
        .filter((obj) => obj.entry !== "template" && obj.entry !== "qrcode")
        .forEach((obj) => {
            snapshotData[obj.entry] = {
                left: obj.left,
                top: obj.top,
                content: obj.type === "text" ? obj.content : obj.getSrc(),
                angle: obj.angle,
                scaleX: obj.scaleX,
                scaleY: obj.scaleY,
                type: obj.type,
                isSprite: true,
            };
        });
    return snapshotData;
};
