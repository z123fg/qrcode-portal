import "./App.css";
import { createContext, useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Actions from "./components/Actions/Actions";
import UserTable from "./components/Table/UserTable";
import EditDialog from "./components/EditDialog/EditDialog";
import defaultCurUserData from "./mockData/defaultCurUserData";
import UploadListDialog from "./components/UploadListDialog/UploadListDialog";
import { destroyCanvas } from "./utils/canvasUtils";

export const UserContext = createContext();

function App() {
    const [context, setContext] = useState({
        curUserData: defaultCurUserData,
        isEditDialogOpen: false,
        lastEntry: null,
        isCanvasReady: false,
        isUploadListDialogOpen: false,
        userDataList: [],
        handleSubmitEdit: () => {},
    });

    const setHandleSubmitEdit = (fn) => {
        setContext((prev) => ({ ...prev, handleSubmitEdit: fn }));
    };

    const openEditDialog = () => {
        setContext((prev) => ({ ...prev, isEditDialogOpen: true }));
    };
    const closeEditDialog = async () => {
        setContext((prev) => ({ ...prev, isEditDialogOpen: false, isCanvasReady: false }));
    };

    const onCloseEditDialog = () => {
        closeEditDialog();
    };

    const setCurUserData = (curUserData) => {
        setContext((prev) => ({ ...prev, curUserData: { ...curUserData } }));
    };

    const updateCanvasStatus = (status) => {
        setContext((prev) => ({
            ...prev,
            isCanvasReady: status,
        }));
    };

    const openUploadListDialog = () => {
        setContext((prev) => ({ ...prev, isUploadListDialogOpen: true }));
    };
    const closeUploadListDialog = () => {
        setContext((prev) => ({ ...prev, isUploadListDialogOpen: false }));
    };

    const handleEditCurUserData = (e) => {
        setContext((prev) => ({
            ...prev,
            lastEntry: e.target.name,
            curUserData: {
                ...prev.curUserData,
                [e.target.name]: { ...prev.curUserData[e.target.name], content: e.target.value },
            },
        }));
    };
    const onCloseUploadListDialog =() => {
        closeUploadListDialog();
    }
    return (
        <UserContext.Provider
            value={{
                context,
                openEditDialog,
                closeEditDialog,
                setCurUserData,
                handleEditCurUserData,
                closeUploadListDialog,
                updateCanvasStatus,
                openUploadListDialog,
                setHandleSubmitEdit,
            }}
        >
            <div className="App">
                <Header />
                <main>
                    <Actions />
                    <UserTable userDataList={context.userDataList} />
                </main>
            </div>
            <EditDialog
                open={context.isEditDialogOpen}
                handleClose={closeEditDialog}
                onClose={onCloseEditDialog}
            />
            <UploadListDialog open={context.isUploadListDialogOpen} handleClose={closeUploadListDialog} onClose={onCloseUploadListDialog} />
        </UserContext.Provider>
    );
}

export default App;
