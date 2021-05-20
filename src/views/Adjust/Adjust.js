import React, { useState, useEffect, memo, useCallback } from "react";

// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";


// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { getImage, getEmployeeList } from '../../utils/api.js'
import Loader from "../Common/Loader";


import styles from "assets/jss/material-dashboard-react/views/employeesStyle.js";
import EmployeesList from "./EmployeeList";
import Attendance from "./Attendance.js";



const useStyles = makeStyles(styles);

export default function Adjust() {
  console.log("adjust");
  const [empData, setEmpData] = useState(null);
  const [empId, setEmpId] = useState(null);
  const [setLoaderFlag, setLoader] = useState(true);
  const updateList = useCallback(
    async (data) => {

      let plist = data.map(async data => {
        return [
          data.userId,
          // data.profileImage ? await getImage(data.profileImage) : '',
          null,
          `${data.firstName} ${data.lastName}`,
          data.otpCode,
          data.mobile,
          data.email
        ]
      });
      let list = await Promise.all(plist);
      setEmpData(list);
      setTimeout(() => {
        setLoader(false)
      }, 500);
    },
    []
  )


  const onEmpClick = useCallback(data => {
    setEmpId({ ...data })
  }, [])

  useEffect(() => {
    getEmployeeList().then(res => {
      updateList(res.data)
    }).catch(err => {
      setLoader(false)
    })

  }, []);
  const classes = useStyles();
  return (
    <div>
      <Loader showLoader={setLoaderFlag} />
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Employees</h4>
              <p className={classes.cardCategoryWhite}>
                Select employee to manage records
              </p>
            </CardHeader>
            <CardBody>
              {empId && <Attendance empId={empId} close={() => setEmpId(null)} />}
              {empData && !empId && <EmployeesList data={empData} onEmpClick={onEmpClick} />}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
