import { defaultImageLeft, defaultImageTop } from "../utils/canvasUtils";

const defaultCurUserData = {
    name: { type: "text", content: "", isSprite: true, left: 700, top: 1150, scaleX: 1, scaleY: 1, angle: 0 },
    idNum: {
        type: "text",
        content: "",
        isSprite: true,
        left: 700,
        top: 1270,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
    },
    organization: {
        type: "text",
        content: "",
        isSprite: true,
        left: 700,
        top: 1375,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
    },
    certNum: {
        type: "text",
        content: "",
        isSprite: true,
        left: 700,
        top: 1480,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
    },
    expDate: {
        type: "text",
        content: "",
        isSprite: true,
        left: 500,
        top: 1600,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
    },
    profileImage: {
        type: "image",
        isSprite: true,
        content: "",
        left: defaultImageLeft,
        top: defaultImageTop,
        scaleX: 1,
        scaleY: 1,
        angle: 0,
    },
    certType: { type: "select", content: "MAAM", isSprite: false },
    issuingAgency: {
        isSprite: false,
        type: "text",
        content: "",
    },
};

export default defaultCurUserData;
