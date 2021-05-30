import React, { useEffect, useState } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Update from "@material-ui/icons/Update";
import Accessibility from "@material-ui/icons/Accessibility";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { dashboardData } from "../../variables/fakeData.js";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Card from "components/Card/Card.js";
import { getDashboardData, getImage } from "../../utils/api";
import Loader from "../Common/Loader";
const useStyles = makeStyles(styles);

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [unCheckedInCount, setUnCheckedInCount] = useState(0);
  const [checkedInUserList, setCheckedInUserList] = useState([]);
  const [unCheckedInUserList, setUnCheckedInUserList] = useState([]);
  const [uncheckedImageList, setUncheckedImageList] = useState([]);
  const classes = useStyles();
  const [setLoaderFlag, setLoader] = useState(true);
  useEffect(() => {
    setLoader(true);
    getDashboardData()
      .then(async (res) => {
        // if(res.data.length === 0) return;
        res = res.data;
        // res = dashboardData;
        let pcheckedInUser = res.checkedInUsers.map(
          async (currentValue, index) => {
            return [
              currentValue.userImagePath
                ? "await getImage(currentValue.userImagePath)"
                : "",
              currentValue.userName,
              currentValue.checkInTime,
            ];
          }
        );
        let punCheckedInUser = res.unCheckedInUsers.map(
          async (currentValue, index) => {
            return [
              currentValue.userImagePath
                ? "await getImage(currentValue.userImagePath)"
                : "",
              currentValue.userName,
            ];
          }
        );
        let checkedInUser = await Promise.all(pcheckedInUser);
        let unCheckedInUser = await Promise.all(punCheckedInUser);
        setCheckedInUserList(checkedInUser);
        setUnCheckedInUserList(unCheckedInUser);
        setCheckedInCount(res.checkedInCount);
        setUnCheckedInCount(res.unCheckedInCount);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
  }, []);

  return (
    <div>
      <Loader showLoader={setLoaderFlag} />
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Checked-in Employees</p>
              <h3 className={classes.cardTitle}>{checkedInCount}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>
                Checked-in Employees Count
              </h4>
              {/* <p className={classes.cardCategoryWhite}>
                New employees on 15th September, 2016
              </p> */}
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["Image", "Name", "Check-in Time."]}
                tableData={checkedInUserList}
                imageAt={0}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Unchecked-in Employees</p>
              <h3 className={classes.cardTitle}>{unCheckedInCount}</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Update />
                Just Updated
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Unchecked-in employees</h4>
              {/* <p className={classes.cardCategoryWhite}>
                New employees on 15th September, 2016
              </p> */}
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["Image", "Name"]}
                tableData={unCheckedInUserList}
                imageAt={0}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
