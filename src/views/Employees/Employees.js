import React, { useEffect, useState, useCallback } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import api from '../../variables/api.json';
import axios from 'axios';
import { bugs, website, server, config } from "variables/general.js";

import Lang from '../../variables/lang.json';

import { setUserSession, setAppCache, appCache, shiftDataCommon, getData } from '../../utils/Common.js';
import styles from "assets/jss/material-dashboard-react/views/employeesStyle.js";

import AddIcon from '@material-ui/icons/Add';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { getImage, getEmployeeReportApi, deleteEmployeeApi } from '../../utils/api.js'
import AddEmployeeForm from './AddEmployeeForm.js'
import SearchIcon from '@material-ui/icons/Search';
import SearchEmployee from './SearchEmployee.js';
import EmployeeCard from './EmployeeCard.js';
import DownloadEmpReport from "./DownloadEmpReport";
import Notification from "../Common/Notification";
import Loader from "../Common/Loader";
const useStyles = makeStyles(styles);

// common functions
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState("");
  let errorFlag = false;
  // let errorMessage = "";
  const handleChange = e => {
    //debugger;
    setValue(e.target.value);
    console.log(e.target.id);
    switch (e.target.id) {
      case 'email':
        if (/(.+)@(.+){2,}\.(.+){2,}/.test(e.target.value) !== true) {
          errorFlag = true;
          setErrorMessage("Enter a valid email");
        } else {
          setErrorMessage("");
        }
    }
  }
  return {
    value,
    onChange: handleChange,
    setValue,
    errorMessage,
    setErrorMessage
  }
}

let shiftDataList = [];


function EmployeesList() {
  const classes = useStyles(styles);
  const [empList, setEmpList] = useState([]);
  const [showAddForm, setAddForm] = useState(false);
  const [showSearch, setSearch] = useState(false);
  const [setLoaderFlag, setLoader] = useState(false);
  const [showNotification, setShowNotification] = useState(null)

  const fetchData = async () => {
    await axios.get(
      api.getUsers,
      {
        params: {
          orgId: appCache('orgId')
        },
        headers: config.headers
      }
    ).then(res => {
      updateList(res.data);
    }).catch((err) => { 
      setTimeout(() => {
        setLoader(false)
      }, 1000);
      console.log("EmployeesList: error")
    });
  };
  const getShiftName = id => {
    const ele = shiftDataList.find(x => x.shiftId === id);
    return ele ? ele.shiftName : "-";
  }
  const updateList = async data => {
    let plist = data.map(async data => {
      return [
        data.userId,
        data.profileImage ? await getImage(data.profileImage) : '',
        `${data.firstName} ${data.lastName}`,
        data.otpCode,
        data.mobile,
        data.email,
        data.address,
        getShiftName(data.shiftId),
        data.hourlyRate
      ]
    });
    let list = await Promise.all(plist);
    setEmpList(list);
  }

  useEffect(() => {
    setLoader(true);
    shiftDataCommon().then(res => {
      shiftDataList = res;
      fetchData();
    })

  }, []);

  const onDelete = useCallback(
    (empId) => {
      setLoader(true);
      deleteEmployeeApi(empId).then(res => {
        shiftDataCommon().then(res => {
          shiftDataList = res;
          fetchData();
          setShowNotification(true)
        })
      })
    },
    [],
  )
  return (
    <GridContainer>
      <Loader showLoader={setLoaderFlag} />
      {
        showNotification && <Notification message="Data Saved!!" close={() => setShowNotification(false)} />
      }
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary" className={classes.flex} style={{ alignItems: "center" }}>
            <h4 className={classes.cardTitleWhite}>Employees</h4>
            <div>
              <Tooltip title={Lang.addEmployee}>
                <IconButton aria-label="add" onClick={() => setAddForm(true)} style={{ color: "#43adc1" }}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={Lang.searchEmployee}>
                <IconButton aria-label="add" onClick={() => setSearch(true)} style={{ color: "#43adc1" }}>
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              {
                empList.length != 0 && <DownloadEmpReport />
              }
            </div>
          </CardHeader>
          <CardBody>
            {showAddForm && <AddEmployeeForm updateEmpList={fetchData} close={() => setAddForm(false)} />}
            {showSearch && <SearchEmployee updateList={updateList} close={() => setSearch(false)} />}
            {empList.length != 0 && <EmployeeCard empList={empList} onDelete={onDelete} closeLoader={() => setLoader(false)}/>}
            {/* <Table
              tableHeaderColor="warning"
              tableHead={[
                "ID",
                "Image",
                "Name",
                "one-time code",
                "mobile number",
                "email", "address",
                "Shift",
                "hourly rate"
              ]}
              tableData={empList}
              imageAt={1}
            /> */}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  )
}



export default function Employees() {
  return (
    <EmployeesList />
  );
}
