import React, { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions } from "@mui/material";
import "./EditDialog.css";

const EditDialog = ({
    rowData = { name: "", idNum: "", organization: "", certNum: "", ExpDate: "" },
    open,
    handleClose,
}) => {
    const [newRowData, setNewRowData] = useState(rowData);

    const handleEdit = (e) => {
        setNewRowData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {};
    return (
        <Dialog open={open} className="edit-dialog">
            <DialogTitle>Add New User</DialogTitle>
            <DialogContent className="edit-dialog_form">
                <TextField
                    style={{ margin: "20px" }}
                    onChange={handleEdit}
                    value={newRowData.name}
                    name="name"
                    label="Name"
                    variant="outlined"
                />
                <TextField
                    style={{ margin: "20px" }}
                    onChange={handleEdit}
                    value={newRowData.idNum}
                    name="idNum"
                    label="ID Number"
                    variant="outlined"
                />
                <TextField
                    style={{ margin: "20px" }}
                    onChange={handleEdit}
                    value={newRowData.organization}
                    name="organization"
                    label="Organization"
                    variant="outlined"
                />
                <TextField
                    style={{ margin: "20px" }}
                    onChange={handleEdit}
                    value={newRowData.certNum}
                    name="certNum"
                    label="Cert Number"
                    variant="outlined"
                />
                <TextField
                    style={{ margin: "20px" }}
                    onChange={handleEdit}
                    value={newRowData.ExpDate}
                    name="ExpDate"
                    label="Expiration Date"
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit}>Submit</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;
