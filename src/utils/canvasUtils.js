import { fabric } from "fabric";

fabric.Canvas.prototype.getObjsByProp = function (...rest) {
    return this.getObjects().filter(obj => {
        return rest.every((kv) => {
            return obj[Object.keys(kv)[0]] === Object.values(kv)[0]
        })
    });
};


let canvas = null;
export const getCanvas = () => canvas;
export const initCanvas = async (type) => {
    const originalWidth = 1654;
    const originalHeight = 2339;
    canvas = new fabric.Canvas("main-canvas", {
        preserveObjectStacking: true,
        stateful: true,
        centeredRotation: false,
        selectionKey: "ctrlKey",
        controlsAboveOverlay: true,
    });
    await new Promise((resolve, reject) => {
        fabric.Image.fromURL(`/${type}.png`, (image) => {
            const imageObj = image.set({
                id: "image_" + 1,
                width: image.width,
                height: image.height,
                selectable: false,
                hasControl: false,
                lockMovementY: true,
                lockMovementX: true,
                entry: "template"
            });
            canvas.add(imageObj).renderAll();
            resolve();
        });
    })

    canvas.setZoom(0.4);
    canvas.setWidth(originalWidth * canvas.getZoom());
    canvas.setHeight(originalHeight * canvas.getZoom());
    canvas.on("object:modified", function (e) {
    })
    canvas.renderAll()

};

export const updateCertEntry = (entry, text) => {
    const targetObj = canvas.getObjsByProp({ entry })[0];
    targetObj.set({ text });
    canvas.renderAll()
}

export const generateCertWithData = (data) => {
    const { id, name, idNum, organization, certNum, expDate } = data;
    const nameTextObj = new fabric.Text(name, {
        cornerStrokeColor: "#B13D6C",
        cornerColor: "#B13D6C",
        cornersize: 1,
        left: 700,
        top: 1150,
        entry: "name",
    });
    const idNumTextObj = new fabric.Text(idNum, {
        cornerStrokeColor: "#B13D6C",
        cornerColor: "#B13D6C",
        cornersize: 1,
        left: 700,
        top: 1270,
        entry: "idNum",
    });
    const organizationTextObj = new fabric.Text(organization, {
        cornerStrokeColor: "#B13D6C",
        cornerColor: "#B13D6C",
        cornersize: 1,
        left: 700,
        top: 1375,
        entry: "organization"
    });
    const certNumTextObj = new fabric.Text(certNum, {
        cornerStrokeColor: "#B13D6C",
        cornerColor: "#B13D6C",
        cornersize: 1,
        left: 700,
        top: 1480,
        entry: "certNum"
    });
    const expDateTextObj = new fabric.Text(expDate, {
        cornerStrokeColor: "#B13D6C",
        cornerColor: "#B13D6C",
        cornersize: 1,
        left: 500,
        top: 1600,
        entry: "expDate"
    });
    canvas.add(nameTextObj, idNumTextObj, organizationTextObj, certNumTextObj, expDateTextObj).renderAll();
};

export const updateProfileImage = (imgObj) => {
    canvas.remove(...canvas.getObjsByProp({ entry: "profileImage" }));
    var image = new fabric.Image(imgObj, { hasControls: true, selectable: true });
    image.set({
        padding: 10,
        cornersize: 5,
        selectable: true,
        hasControls: true,
        cornerStrokeColor: "#B13D6C",
        transparentCorners: false,
        cornerColor: "#B13D6C",
        originX: "center",
        originY: "center",
        left: 1235,
        top: 1345,
        entry: "profileImage"
    });
    image.scaleToHeight(275)
    getCanvas().add(image);
    getCanvas().renderAll();
}


export const getSnapshotData = () => {
    canvas.getObjects().filter(obj => obj.entry !== "template").forEach(obj => {
        console.log("obj",obj)
    })
}


/* 

[
    {
        type:"text",
        content:"aosidjo",
        left:
        top:
        scale:
        angle:
    },
    {
        type:"image",
        content:"sdsdf",
        left
        top
        scale
        angle
    }
]
*/
