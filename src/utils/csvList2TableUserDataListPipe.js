import { invCertTypeMap } from "../components/EditDialog/EditDialog";
import defaultCurUserData from "../mockData/defaultCurUserData";

//
const csvList2TableUserDataListPipe = (csvList) => {

    return csvList.map((item) => {
        const result = {};
        for (let key in item) {
            let value = item[key];
            if (key === "certType") {
                value = invCertTypeMap[value];
            }
            result[key] = { ...defaultCurUserData[key], content: value };
        }

        Object.entries(defaultCurUserData).forEach(([key, defaultEntryObj]) => {
            if (result[key] === undefined) {
                result[key] = defaultEntryObj;
            }
        })
        return result;
    });
};

export default csvList2TableUserDataListPipe;
