import React from "react";
import moment from "moment";
import {
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    TableContainer,
    Paper,
    IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import "./UserTable.css";
import { certTypeMap } from "../EditDialog/EditDialog";
import { v4 as uuidv4 } from "uuid";
import intl from "../../intl/intl";

const UserTable = ({ userDataList, handleClickEditTableRow, columns }) => {
    return (
        <section className="userTable-container">
            <TableContainer component={Paper}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((key) => (
                                <TableCell key={key}>{intl[key] }</TableCell>
                            ))}
                            <TableCell>{intl.actions}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userDataList.map((row) => {
                            return (
                                <TableRow key={row._id || uuidv4()}>
                                    {columns.map((key) => {
                                        let value;
                                        if (key === "certType") {
                                            value = certTypeMap[row[key].content];
                                        } else if (key === "createTime" || key === "updateTime") {
                                            value = moment(+row[key].content).format("YYYY-MM-DD HH:mm:ss");
                                        } else if (key === "_id") {
                                            value = row[key];
                                        } else {
                                            value = row[key]?.content;
                                        }
                                        return <TableCell style={{maxWidth:"200px", wordBreak:"break-all"}} key={key + row._id || uuidv4()}>{value}</TableCell>;
                                    })}
                                    <TableCell>
                                        <IconButton onClick={() => handleClickEditTableRow(row._id)}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </section>
    );
};

export default UserTable;
