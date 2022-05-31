import { fabric } from "fabric";

let canvas = null;
export const getCanvas = () => canvas;
export const initCanvas = () => {
    canvas = new fabric.StaticCanvas("canvas", { width: 1654, height: 2339 });
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
