import { useContext } from "react";
import { PortalContext } from "../App";
import {
    createSingleUserData,
    createUserDataList,
    deleteUserData,
    updateUserData,
} from "../services/userData";

const useServiceHelper = () => {
    const { refreshGlobalUserDataList, setUserInfo, showBackdrop, showAlert,setLinearProgressProps } = useContext(PortalContext);

    const createSingleUserDataCarefully = async (snapshot) => {
        showBackdrop(true);
        try {
            await createSingleUserData(snapshot);
            refreshGlobalUserDataList();
            showAlert({ type: "success", message: "创建证书成功！" });
        } catch (err) {
            console.log("err", err);
            if (err?.response?.status === 401) {
                alert("登录信息已经失效了，需要重新登陆。");
                setUserInfo(null);
            } else {
                alert(`保存证书失败了，这里是错误信息，可以问我：${err?.response?.data?.message}`);
            }
        }
        showBackdrop(false);
    };

    const createUserDataListCarefully = async (userDataList, onSuccess) => {
        //showBackdrop(true);
        setLinearProgressProps({progress:0, title:"正在上传证书图片及信息...", open:true})

        try{
            await createUserDataList(userDataList, setLinearProgressProps);
            refreshGlobalUserDataList()
            showAlert({ type: "success", message: "创建证书列表成功！" });
            onSuccess()
        }
        catch(err){
            console.log("err",err);
            if(err?.response?.status === 401){
                alert("登录信息已经失效了，需要重新登陆。")
                setUserInfo(null)
            }else{
                alert(`保存证书列表失败了，这里是错误信息，可以问我：${err?.response?.data?.message}`)
            }
            
        }
        setLinearProgressProps({progress:null, title:null, open:false})

       // showBackdrop(false);
    };

    const updateUserDataCarefully = async (userData) => {
        showBackdrop(true);
        try {
            await updateUserData(userData);
            refreshGlobalUserDataList();
            showAlert({ type: "success", message: "更新证书成功！" });
        } catch (err) {
            console.log("err", err);
            if (err?.response?.status === 401) {
                alert("登录信息已经失效了，需要重新登陆。");
                setUserInfo(null);
            } else {
                alert(`修改证书失败了，这里是错误信息，可以问我：${err?.response?.data?.message}`);
            }
        }
        showBackdrop(false);
    };
    const deleteUserDataCarefully = async (id) => {
        showBackdrop(true);
        try {
            await deleteUserData(id);
            refreshGlobalUserDataList();
            showAlert({ type: "success", message: "删除证书成功！" });
        } catch (err) {
            console.log("err", err);
            if (err?.response?.status === 401) {
                alert("登录信息已经失效了，需要重新登陆。");
                setUserInfo(null);
            } else {
                alert(`删除证书失败了，这里是错误信息，可以问我：${err?.response?.data?.message}`);
            }
        }
        showBackdrop(false);
    };

    return {
        createSingleUserDataCarefully,
        updateUserDataCarefully,
        createUserDataListCarefully,
        deleteUserDataCarefully,
    };
};

export default useServiceHelper;
