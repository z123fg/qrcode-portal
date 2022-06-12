import React, { useState } from "react";
import {
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    TableContainer,
    Paper,
    TextField,
    Typography,
    Button,
    IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./UserTable.css";
import EditDialog, { certTypeMap } from "../EditDialog/EditDialog";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from 'uuid';


const UserTable = ({ userDataList, handleClickEditTableRow , columns}) => {
    const [keyword, setKeyword] = useState("");
    
    const handleInputKeyword = (e) => {
        setKeyword(e.target.value);
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

   
    return (
        <section className="userTable-container">
            {userDataList.length > 0 ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        flexDirection: "column",
                    }}
                >
                    <TextField
                        label="Search"
                        variant="outlined"
                        onChange={handleInputKeyword}
                        value={keyword}
                    />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map((key) => (
                                        <TableCell key={key}>{key}</TableCell>
                                    ))}
                                    <TableCell>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {generateFilteredList().map((row) => {
                                    return (
                                        <TableRow key={row._id||uuidv4()}>
                                            {columns.map((key) => {
                                                let value = row[key].content;
                                                if (key === "certType") {
                                                    value = certTypeMap[value];
                                                }

                                                return (
                                                    <TableCell key={key + row._id||uuidv4()}>
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                <IconButton onClick={() => handleClickEditTableRow(row.serialNum.content)}>
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        flexDirection: "column",
                    }}
                >
                    <Typography>no data available</Typography>
                    <Button>retry</Button>
                </div>
            )}
        </section>
    );
};

export default UserTable;
