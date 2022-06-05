import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions, Input, Select, MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material";
import "./EditDialog.css";
import Canvas from "../Canvas/Canvas";
import { fabric } from "fabric";
import { generateCertWithData, getCanvas, getSnapshotData, getSpriteData, initCanvas, updateCertEntry, updateProfileImage } from "../../utils/canvasUtils";

const certTypeMap = {
    MAAM: "光谱分析（A类）中级人员",
    MAAS: "光谱分析（A类）高级人员",
    MABM: "光谱分析（B类）中级人员",
    MPE: "力学性能试验初级人员",
    MPM: "力学性能试验中级人员",
    MPS: "力学性能试验高级人员",
    MTE: "金相检验初级人员",
    MTM: "金相检验中级人员",
    MTS: "金相检验高级人员",
}

const EditDialog = ({
    rowData = { name: "", idNum: "", organization: "", certNum: "", expDate: "" },
    open,
    handleClose,
}) => {
    const [newRowData, setNewRowData] = useState(rowData);
    const [certType, setCertType] = useState("MAAM");
    const [imageFile, setImageFile] = useState("");

    useEffect(() => {
        if (open) {
            setTimeout(async () => {
                await initCanvas(certType);
                generateCertWithData(newRowData);
            })
        }

    }, [open])
    const handleEdit = (e) => {
        setNewRowData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        updateCertEntry(e.target.name, e.target.value)
    };

    const handleSelectCertType = (e) => {
        setCertType(e.target.value);
        initCanvas(e.target.value);
    }

    const handleSubmit = () => {
        getSnapshotData();
    };

    const handleChangeUploadImage = (event) => {
        
        var reader = new FileReader();
        reader.onload = function (event) {
            var imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function () {
                updateProfileImage(imgObj)
            };
        };
        reader.readAsDataURL(event.target.files[0]);
    };
    return (
        <Dialog maxWidth={"1000px"} open={open} className="edit-dialog">
            <DialogTitle>Add New User</DialogTitle>

            <DialogContent className="edit-dialog_form">
                <FormControl style={{ margin: "20px" }}>
                    <InputLabel id="demo-simple-select-label">Age</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={certType}
                        label="Age"
                        onChange={handleSelectCertType}
                    >
                        {Object.entries(certTypeMap).map(([key, value]) => (<MenuItem key={key} value={key}>{value}</MenuItem>))}
                    </Select>
                </FormControl>


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
                    name="expDate"
                    label="Expiration Date"
                    variant="outlined"
                />
                <label htmlFor="contained-button-file">
                    <Input
                        onChange={handleChangeUploadImage}
                        style={{ display: "none" }}
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        value={imageFile}
                    />
                    <Button variant="contained" component="span" onClick={()=>{setImageFile("")}}>
                        Upload
                    </Button>
                </label>
                <Canvas />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleSubmit}>Submit</Button>
                <Button>Delete</Button>
                <Button>Download</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDialog;
