import React from "react";
import UserTable from "../Table/UserTable";

const globalUserTableColumns  = [
    "name",
    "idNum",
    "organization",
    "certNum",
    "expDate",
    "issuingAgency",
    "hasProfileImage",
    "certType",
    "updateTime",
    "createTime"
];
const GlobalUserTable = ({userDataList}) => {
    return (
        <UserTable userDataList={userDataList} columns={globalUserTableColumns} handleClickEditTableRow={()=>{}}/>
    )
}


export default GlobalUserTable;