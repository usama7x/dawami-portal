import React, { useEffect, useState, memo, useRef } from "react";
import { getImage, getEmployeeReportApi, getFile } from '../../utils/api.js';
import GetAppIcon from '@material-ui/icons/GetApp';


import Lang from '../../variables/lang.json';

import { setUserSession, setAppCache, appCache, shiftData, getData } from '../../utils/Common.js';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';


const DownloadEmpReport = memo(() => {
    const inputEl = useRef(null);
    const [empReportLink, setEmpReportLink] = useState("");
    const downloadReport = async () => {
        let dataUrl = await getEmployeeReportApi();
        await getFile(dataUrl.data).then(res => {
          let today = new Date();
          setEmpReportLink({
            name:appCache('orgName')+today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+'.xlsx',
            url:res
          })
        })
      };
      useEffect(()=> {
        inputEl.current.click();
      },[empReportLink])
      return (
          <span>
              <Tooltip title={Lang.downloadReport}>
                <IconButton aria-label="Download Report" onClick={downloadReport} style={{ color: "#43adc1" }}>
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
              <a href={empReportLink.url} download={empReportLink.name} style={{visibility:"hidden"}} ref={inputEl}></a>
          </span>
      )
});

export default DownloadEmpReport;