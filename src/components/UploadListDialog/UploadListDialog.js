import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React, { useState } from "react";

const UploadListDialog = ({ open, handleClose }) => {
    const [imageFile, setImageFile] = useState("");

    const handleChangeUploadImage = (event) => {
        console.log("files", event.target.files);
        Array.from(event.target.files).forEach(file=>console.log(file))
        var reader = new FileReader();
        reader.onload = function (event) {
            console.log("file", event.target.result)
        };
        reader.readAsDataURL(event.target.files[0]);
    };
    return (
        <Dialog open={open}>
            <DialogContent>
                <label htmlFor="csv-upload">
                    <input
                        value={imageFile}
                        id="csv-upload"
                        type={"file"}
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleChangeUploadImage}
                    />
                    <Button onClick={() => setImageFile("")} component="span" variant="contained">
                        Add multiple user
                    </Button>
                </label>
            </DialogContent>
            <DialogActions>
                <Button>Submit</Button>
                <Button>Delete</Button>
                <Button>Download</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadListDialog;
