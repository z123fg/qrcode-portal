import defaultCurUserData from "../mockData/defaultCurUserData";


const tableUserData2CanvasUserDataPipe = (obj) => {
    const result=  {};
    Object.entries(defaultCurUserData).forEach(([prop,value])=>{
       result[prop] = obj[prop]||value;
    })
    return result
}

export default tableUserData2CanvasUserDataPipe