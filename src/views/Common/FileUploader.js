import React, { memo, useRef, useState } from "react";
import Loader from "../Common/Loader";
import {
    getCompanyData,
    getImage,
    updatePassordApi,
    uploadFile,
    updateCompanyProfileApi,
  } from "../../utils/api";
  import Button from "components/CustomButtons/Button.js";
  import Lang from '../../variables/lang.json';


// @output -> image name and image data url
const FileUploader = memo(({ onSuccess }) => {
    const fileInput = useRef(null)
    const [setLoaderFlag, setLoader] = useState(false);
    const uploadProfilePhoto = (e) => {
        const formData = new FormData();
        formData.append("file", e);
        uploadFile(formData).then((res) => {
            let imageName=res.data
            getImage(res.data).then(res => {
                let imagePath = res;
                setLoader(false);
                onSuccess(imageName, imagePath)
            })
        })
            .catch((err) => console.log("File Upload Error"));
    }
    const handleFileInput = (e) => {
        // debugger
        if(e.target.files[0].length == 0 || (e.target.files[0].size > 1000 * 1024)) {
            return;
        }
        // handle validations
        setLoader(true)
        uploadProfilePhoto(e.target.files[0])
    }

    return (
        
        <div className="file-uploader">
            <Loader showLoader={setLoaderFlag} />
            <input type="file" onChange={handleFileInput} ref={fileInput} style={{ display: "none" }} accept="image/*" />
            <Button style={{display:"block", lineHeight:"10px"}} onClick={e => fileInput.current && fileInput.current.click()} color="primary">{Lang.uploadImage} <br/><strong style={{fontSize:"8px"}}>max size 1mb</strong></Button>
        </div>
    )
})

export default FileUploader;