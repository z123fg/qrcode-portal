import { fabric } from "fabric";
import JSZip from "jszip";
import { saveAs } from "file-saver";
export const defaultImageLeft = 1242;
export const defaultImageTop = 1330;
/* 
name: { type: "text", content: "", left: 700, top: 1150, scaleX: 1, scaleY: 1, angle: 0 },
    idNum: { type: "text", content: "", left: 700, top: 1270, scaleX: 1, scaleY: 1, angle: 0 },
    organization: { type: "text", content: "", left: 700, top: 1375, scaleX: 1, scaleY: 1, angle: 0 },
    certNum: { type: "text", content: "", left: 700, top: 1480, scaleX: 1, scaleY: 1, angle: 0 },
    expDate: { type: "text", content: "", left: 500, top: 1600, scaleX: 1, scaleY: 1, angle: 0 },
    profileImage: { type: "image", content: "", left: defaultImageLeft, top: defaultImageTop, scaleX: 1, scaleY: 1, angle: 0 },

*/

const canvasDisplayEntryList = new Set([
  "idNum",
  "organization",
  "certNum",
  "expDate",
  "name",
  "profileImage",
]);

const defaultImageProps = {
  padding: 10,
  cornersize: 5,
  selectable: true,
  hasControls: true,
  cornerStrokeColor: "#B13D6C",
  transparentCorners: false,
  cornerColor: "#B13D6C",
  originX: "center",
  originY: "center",
  left: 1242,
  top: 1330,
  entry: "profileImage",
};

const defaultTextProps = {
  name: {
    cornerStrokeColor: "#B13D6C",
    cornerColor: "#B13D6C",
    cornersize: 1,
    left: 700,
    top: 1150,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    entry: "name",
  },
  idNum: {
    cornerStrokeColor: "#B13D6C",
    cornerColor: "#B13D6C",
    cornersize: 1,
    left: 700,
    top: 1270,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    entry: "idNum",
  },
  organization: {
    cornerStrokeColor: "#B13D6C",
    cornerColor: "#B13D6C",
    cornersize: 1,
    left: 700,
    top: 1375,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    entry: "organization",
  },
  certNum: {
    cornerStrokeColor: "#B13D6C",
    cornerColor: "#B13D6C",
    cornersize: 1,
    left: 700,
    top: 1480,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    entry: "certNum",
  },
  expDate: {
    cornerStrokeColor: "#B13D6C",
    cornerColor: "#B13D6C",
    cornersize: 1,
    left: 500,
    top: 1600,
    scaleX: 1,
    scaleY: 1,
    angle: 0,
    entry: "expDate",
  },
};

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
  const originalWidth = 1654;
  const originalHeight = 2339;
  canvas = new fabric.Canvas("main-canvas", {
    preserveObjectStacking: true,
    stateful: true,
    centeredRotation: false,
    selectionKey: "ctrlKey",
    controlsAboveOverlay: true,
  });
  canvas.setZoom(0.4);
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

      oldTemplateObjs.forEach(obj=>{canvas.remove(obj).renderAll()})
      canvas.add(imageObj).sendToBack(imageObj).renderAll();
      resolve();
    });
  });
};

export const updateCertEntry = (curUserData) => {
  Object.entries(curUserData).forEach(([key, value]) => {
    const targetObj = canvas.getObjsByProp({ entry: key })[0];
    if (targetObj?.type === "text" && targetObj.text !== value?.content) {
      targetObj.set({ text: value.content });
      canvas.renderAll();
    }
  });
};
export const updateProfileImage = async (imgObj) => {
  const oldImageObj = canvas.getObjsByProp({ entry: "profileImage" })[0];
  if (oldImageObj !== undefined) canvas.remove(oldImageObj);
  fabric.Image.fromURL(imgObj, (image) => {
    image.set({
      ...defaultImageProps,
    });
    image.scaleToHeight(275);
    canvas.add(image).renderAll();
  });
};

export const downloadCanvasAsImage = () => {
  const url = canvas?.toDataURL({
    format: "png",
    enableRetinaScaling: true,
    multiplier: 2.5,
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

export const downloadMultipleCanvasImagesAsZip = async (
  userDataList,
  setProgress
) => {
  let zip = new JSZip();
  for (let i = 0; i < userDataList.length; i++) {
    const userData = userDataList[i];
    initCanvas();
    await loadTemplate(userData.certType.content);
    await generateCertWithData(userData);
    const url = canvas?.toDataURL({
      format: "png",
      enableRetinaScaling: true,
      multiplier: 2.5,
    });
    const blob = await fetch(url).then((res) => res.blob());
    zip.file(`${userData._id}.png`, blob);
    setProgress(i);
  }

  await zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "certificates.zip");
  });
};

export const generateCertWithData = async (rowData) => {
  return new Promise((resolve1) => {
    const spriteDataList = Object.entries(rowData)
      .filter(([key, value]) => canvasDisplayEntryList.has(key))
      .map(([key, value]) => ({ entry: key, ...value }));
    spriteDataList
      .filter((item) => item.type === "text")
      .forEach((item) => {
        const obj = new fabric.Text(item.content, {
          ...defaultTextProps,
          left: +item.left,
          top: +item.top,
          entry: item.entry,
          angle: +item.angle,
          scaleX: +item.scaleX,
          scaleY: +item.scaleY,
        });
        canvas.add(obj);
        canvas.bringToFront(obj);
        canvas.renderAll();
      });

    Promise.all(
      spriteDataList
        .filter((item) => item.type === "image")
        .map((item) => {
          return new Promise((resolve) => {
            fabric.Image.fromURL(item.content, (image) => {
              image.set({
                ...defaultImageProps,
                left: +item.left,
                top: +item.top,
                entry: item.entry,
                angle: +item.angle,
                scaleX: +item.scaleX,
                scaleY: +item.scaleY,
              });
              canvas.add(image);
              canvas.bringToFront(image);
              canvas.renderAll();
              resolve();
            });
          });
        })
    ).then(() => {
      resolve1();
    });
  });
};

export const getSnapshotData = (certType) => {
  const snapshotData = {};
  canvas
    .getObjects()
    .filter((obj) => obj.entry !== "template")
    .forEach((obj) => {
      snapshotData[obj.entry] = {
        left: obj.left,
        top: obj.top,
        content: obj.type === "text" ? obj.text : obj.getSrc(),
        angle: obj.angle,
        scaleX: obj.scaleX,
        scaleY: obj.scaleY,
        type: obj.type,
      };
    });
  snapshotData.certType = { content: certType, type: "select" };
  return snapshotData;
};
