import React, { useEffect, useState, memo, useRef, useCallback } from "react";
import { getImage, getEmployeeReportApi, getFile } from '../../utils/api.js';
import GetAppIcon from '@material-ui/icons/GetApp';
import Loader from "../Common/Loader";
import Notification from "../Common/Notification";
import Lang from '../../variables/lang.json';

import { setUserSession, setAppCache, appCache, shiftData, getData } from '../../utils/Common.js';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';


const DownloadReport = memo(({ reportApi, startDate, endDate, userId }) => {
  const inputEl = useRef(null);
  const [empReportLink, setEmpReportLink] = useState("");
  const [setLoaderFlag, setLoader] = useState(false);
  const [showNotification, setShowNotification] = useState(null)
  const showNotificationCB = useCallback(
    () => {
      setShowNotification("true")
    },
    [],
  )
  const downloadReport = async () => {
    setLoader(true)
    let dataUrl;
    try {
      if (userId) {
        dataUrl = await reportApi(userId, startDate, endDate);
      } else {
        dataUrl = await reportApi(startDate, endDate);
      }
    } catch (err) {
      setLoader(false)
      showNotificationCB();
      return false
    }
    if (!dataUrl.data) {
      setLoader(false)
      showNotificationCB();
      return false
    }
    await getFile(dataUrl.data).then(res => {
      let today = new Date();
      setEmpReportLink({
        name: appCache('orgName') + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '.xlsx',
        url: res
      })
      setLoader(false)
    })
  };
  useEffect(() => {
    inputEl.current.click();
  }, [empReportLink])
  return (
    <span>
      <Loader showLoader={setLoaderFlag} />
      {
        showNotification && <Notification message="No report found.." close={() => setShowNotification(false)} />
      }
      <Tooltip title={Lang.downloadReport}>
        <IconButton aria-label="Download Report" onClick={downloadReport} style={{ color: "#43adc1" }}>
          <GetAppIcon />
        </IconButton>
      </Tooltip>
      <a href={empReportLink.url} download={empReportLink.name} style={{ visibility: "hidden" }} ref={inputEl}></a>
    </span>
  )
});

export default DownloadReport;