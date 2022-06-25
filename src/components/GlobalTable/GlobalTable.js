import {
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { prepareCertImageForUpload } from "../../utils/canvasUtils";
import intl from "../../intl/intl";

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

const tableSortOptions = ["createTime", "updateTime", "hasProfileImage", "expDate", "certNum"];
const GlobalUserTable = ({ userDataList }) => {
    const { refreshGlobalUserDataList } = useContext(PortalContext);
    const [keyword, setKeyword] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [curUserData, setCurUserData] = useState(defaultCurUserData);
    const { deleteUserDataCarefully, updateUserDataCarefully } = useServiceHelper();
    const [tableSortOption, setTableSortOption] = useState("createTime");
    const [isAscending, setIsAscending] = useState(true);

    const handleInputKeyword = (e) => {
        setKeyword(e.target.value);
    };

    const handleCloseEdit = () => {
        setIsEditDialogOpen(false);
    };

    const handleSubmitEdit = async (snapshot) => {
        console.log("snapShot", snapshot, curUserData);
        prepareCertImageForUpload(snapshot);
        await updateUserDataCarefully(snapshot);
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
        let displayedList = userDataList.map((item) => ({
            ...item,
            hasProfileImage: {
                content:
                    (item?.profileImage?.content?.length || "") > 10 ? (
                        <CheckIcon sx={{ color: "green" }} />
                    ) : (
                        <CloseIcon sx={{ color: "red" }} />
                    ),
            },
        }));
        if (keyword !== "") {
            displayedList = displayedList.filter((row) =>
                Object.values(row).some((entry) => (entry.content + "").includes(keyword))
            );
        }
        displayedList.sort((a, b) => {
            if (tableSortOption === "hasProfileImage") {
                return isAscending
                    ? ((a?.profileImage?.content?.length || "") > 10) -
                          ((b?.profileImage?.content?.length || "") > 10)
                    : ((b?.profileImage?.content?.length || "") > 10) -
                          ((a?.profileImage?.content?.length || "") > 10);
            }
            if (tableSortOption === "expDate" || tableSortOption === "certNum") {
                return isAscending
                    ? b[tableSortOption].content.localeCompare(a[tableSortOption].content)
                    : a[tableSortOption].content.localeCompare(b[tableSortOption].content);
            }
            return isAscending
                ? b[tableSortOption].content - a[tableSortOption].content
                : a[tableSortOption].content - b[tableSortOption].content;
        });
        return displayedList;
    };
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
                            label="搜索"
                            variant="outlined"
                            onChange={handleInputKeyword}
                            value={keyword}
                            size="small"
                        />
                        <IconButton onClick={refreshGlobalUserDataList}>
                            <RefreshIcon />
                        </IconButton>
                        <FormControl>
                            <InputLabel id="table-sort-option-select-label">排序</InputLabel>
                            <Select
                                size="small"
                                labelId="table-sort-option-select-label"
                                label="排序"
                                value={tableSortOption}
                                onChange={(e) => {
                                    setTableSortOption(e.target.value);
                                }}
                            >
                                {tableSortOptions.map((item) => (
                                    <MenuItem key={item} value={item}>
                                        {intl[item]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <IconButton onClick={() => setIsAscending((prev) => !prev)}>
                            {isAscending ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
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
                isGlobal
            />
        </div>
    );
};

export default GlobalUserTable;
