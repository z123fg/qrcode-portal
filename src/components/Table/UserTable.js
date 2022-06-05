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
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import "./UserTable.css";
import mockUserList from "../../mockData/mockUserList";

const KEYS = ["name", "idNum", "organization", "certNum", "expDate"];

const UserTable = () => {
    const [userList, setUserList] = useState(mockUserList);
    const [keyword, setKeyword] = useState("");

    const handleInputKeyword = (e) => {
        setKeyword(e.target.value);
    };

    const generateFilteredList = () => {
        if (keyword === "") return userList;
        return userList.filter((row) => Object.values(row).some((entry) => (entry+"").includes(keyword)));
    };
    return (
        <section className="userTable-container">
            {userList.length > 0 ? (
                <div
                    style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", flexDirection:"column" }}
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
                                    {KEYS.map((key) => (
                                        <TableCell key={key}>{key}</TableCell>
                                    ))}
                                    <TableCell>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {generateFilteredList().map((row) => (
                                    <TableRow key={row.id}>
                                        {KEYS.map((key) => (
                                            <TableCell key={key + row.id}>{row[key]}</TableCell>
                                        ))}
                                        <TableCell>
                                            <IconButton>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton>
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton>
                                                <DownloadIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
