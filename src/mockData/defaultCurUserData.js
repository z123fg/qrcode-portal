import { defaultImageLeft, defaultImageTop } from "../utils/canvasUtils";

const defaultCurUserData = {
    certType: { type: "select", content: "MAAM" },
    name: { type: "text", content: "", left: 700, top: 1150, scaleX: 1, scaleY: 1, angle: 0 },
    idNum: { type: "text", content: "", left: 700, top: 1270, scaleX: 1, scaleY: 1, angle: 0 },
    organization: { type: "text", content: "", left: 700, top: 1375, scaleX: 1, scaleY: 1, angle: 0 },
    certNum: { type: "text", content: "", left: 700, top: 1480, scaleX: 1, scaleY: 1, angle: 0 },
    expDate: { type: "text", content: "", left: 500, top: 1600, scaleX: 1, scaleY: 1, angle: 0 },
    profileImage: {
        type: "image",
        content: "",
        left: defaultImageLeft,
        top: defaultImageTop,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
    },
};


export default defaultCurUserData;