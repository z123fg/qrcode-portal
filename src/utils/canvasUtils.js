import { fabric } from "fabric";

let canvas = null;
export const getCanvas = () => canvas;
export const initCanvas = () => {
    const originalWidth = 1654;
    const originalHeight = 2339;
    canvas = new fabric.Canvas("main-canvas", {
        preserveObjectStacking: true,
        stateful: true,
        centeredRotation: false,
        selectionKey: "ctrlKey",
        controlsAboveOverlay: true,
    });

    fabric.Image.fromURL("/1.metallographic-testing(entry)-1.png", (image) => {
        const imageObj = image.set({
            id: "image_" + 1,
            width: image.width,
            height: image.height,
            selectable:false,
            hasControl:false,
            lockMovementY :true,
            lockMovementX:true
        });
        canvas.add(imageObj).renderAll();
        generateCertWithData({name:"yizhou zhou", idNum:"1231331231231", organization:"antra", certNum:"12333123123", expDate:"2022"});
    });
    canvas.setZoom(0.4);
    canvas.setWidth(originalWidth * canvas.getZoom());
    canvas.setHeight(originalHeight * canvas.getZoom());
};

export const generateCertWithData = (data) => {
    const { id, name, idNum, organization, certNum, expDate } = data;
    const nameTextObj = new fabric.Text(name, {
        left: 700,
        top: 1150,
    });
    const idNumTextObj = new fabric.Text(idNum, {
        left: 700,
        top: 1270,
    });
    const organizationTextObj = new fabric.Text(organization, {
        left: 700,
        top: 1375,
    });
    const certNumTextObj = new fabric.Text(certNum, {
        left: 700,
        top: 1480,
    });
    const expDateTextObj = new fabric.Text(expDate, {
        left: 500,
        top: 1600,
    });
    canvas.add(nameTextObj, idNumTextObj, organizationTextObj, certNumTextObj, expDateTextObj).renderAll();
};
