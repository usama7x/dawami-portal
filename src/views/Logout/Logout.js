import React, {useEffect} from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import {removeUserSession} from "../../utils/Common.js"


import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Logout(props) {
  const classes = useStyles();
  useEffect(() => {
    removeUserSession();
    props.history.push('/login');
  });
  return (
    <div>
      <GridContainer>

      </GridContainer>
    </div>
  );
}
