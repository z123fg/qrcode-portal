import { Button, IconButton, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { PortalContext } from "../../App";
import UserTable from "../Table/UserTable";
import RefreshIcon from "@mui/icons-material/Refresh";
import "./GlobalTable.css";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditDialog from "../EditDialog/EditDialog";
import defaultCurUserData from "../../mockData/defaultCurUserData";
import useServiceHelper from "../../hooks/useServiceHelper";

const globalUserTableColumns = [
    "name",
    "idNum",
    "organization",
    "certNum",
    "expDate",
    "issuingAgency",
    "hasProfileImage",
    "certType",
    "updateTime",
    "createTime",
];
const GlobalUserTable = ({ userDataList }) => {
    const { refreshGlobalUserDataList } = useContext(PortalContext);
    const [keyword, setKeyword] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [curUserData, setCurUserData] = useState(defaultCurUserData);
    const { deleteUserDataCarefully, updateUserDataCarefully } = useServiceHelper();

    const handleInputKeyword = (e) => {
        setKeyword(e.target.value);
    };

    const handleCloseEdit = () => {
        setIsEditDialogOpen(false);
    };

    const handleSubmitEdit = async (snapshot) => {
        console.log("cud",curUserData);
        snapshot = {...curUserData,...snapshot}
        await updateUserDataCarefully(snapshot);
        handleCloseEdit();
    };

    const handleDeleteEdit = async () => {
        await deleteUserDataCarefully(curUserData._id);
        handleCloseEdit();
    };

    const handleClickEditTableRow = (id) => {
        setCurUserData(userDataList.find((item) => item._id === id));
        setIsEditDialogOpen(true);
    };

    const generateFilteredList = () => {
        const displayedList = userDataList.map((item) => ({
            ...item,
            hasProfileImage: {
                content:
                    item?.profileImage?.content?.length || "" > 10 ? (
                        <CheckIcon sx={{ color: "green" }} />
                    ) : (
                        <CloseIcon sx={{ color: "red" }} />
                    ),
            },
        }));
        if (keyword === "") return displayedList;
        return displayedList.filter((row) =>
            Object.values(row).some((entry) => (entry.content + "").includes(keyword))
        );
    };
    console.log("udl", userDataList);
    return (
        <div className="global-table__container">
            {userDataList.length > 0 ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "start",
                        width: "100%",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    <div style={{ display: "flex", gap: "10px" }}>
                        <TextField
                            label="Search"
                            variant="outlined"
                            onChange={handleInputKeyword}
                            value={keyword}
                            size="small"
                        />
                        <IconButton onClick={refreshGlobalUserDataList}>
                            <RefreshIcon />
                        </IconButton>
                    </div>
                    <UserTable
                        userDataList={generateFilteredList()}
                        columns={globalUserTableColumns}
                        handleClickEditTableRow={handleClickEditTableRow}
                    />
                </div>
            ) : (
                <>
                    <Typography>没有发现任何证书</Typography>
                    <Button onClick={refreshGlobalUserDataList}>刷新</Button>
                </>
            )}
            <EditDialog
                open={isEditDialogOpen}
                curUserData={curUserData}
                onClose={() => {}}
                handleSubmit={handleSubmitEdit}
                handleDelete={handleDeleteEdit}
                handleClose={handleCloseEdit}
            />
        </div>
    );
};

export default GlobalUserTable;
