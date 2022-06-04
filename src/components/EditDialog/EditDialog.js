import React, { useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions, Input } from "@mui/material";
import "./EditDialog.css";
import Canvas from "../Canvas/Canvas";
import { fabric } from "fabric";
import { getCanvas } from "../../utils/canvasUtils";

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

    const handleChangeUploadImage = (event) => {
        var reader = new FileReader();
        reader.onload = function (event) {
            console.log(event.target.result);
            var imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function () {
                var image = new fabric.Image(imgObj, { hasControls: true, selectable: true });
                image.set({
                    padding: 10,
                    cornersize: 5,
                    selectable: true,
                    hasControls: true,
                    cornerStrokeColor: "#B13D6C",
                    transparentCorners: false,
                    cornerColor: "#B13D6C",
                    originX: "center",
                    left: 1235,
                    top: 1185,
                });
                const initWidth = image.width;
                const initHeight = image.height;
                const targetScale = Math.max(175 / initWidth, 255 / initHeight);
                image.scale(targetScale);
                console.log(initWidth, initHeight);
                getCanvas().add(image);

                getCanvas().renderAll();
            };
        };
        reader.readAsDataURL(event.target.files[0]);
    };
    return (
        <Dialog maxWidth={"1000px"} open={open} className="edit-dialog">
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
                <label htmlFor="contained-button-file">
                    <Input
                        onChange={handleChangeUploadImage}
                        style={{ display: "none" }}
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                    />
                    <Button variant="contained" component="span">
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
