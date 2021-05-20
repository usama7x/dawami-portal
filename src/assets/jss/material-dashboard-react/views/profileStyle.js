import {
  successColor,
  whiteColor,
  grayColor,
  hexToRgb
} from "assets/jss/material-dashboard-react.js";

const profileStyle = {
  successText: {
    color: successColor[0]
  },
  upArrowCardCategory: {
    width: "16px",
    height: "16px"
  },
  stats: {
    color: grayColor[0],
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    }
  },
  cardCategory: {
    color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0"
  },
  cardCategoryWhite: {
    color: "rgba(" + hexToRgb(whiteColor) + ",.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardTitleWhite: {
    color: whiteColor,
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  customImageType1: {
    width: "200px",
    height: "200px",
    margin: "auto",
    backgroundSize: "contain"
  },
  formControl: {
    paddingBottom: "10px",
    margin: "27px 0 0 0"
  },
  hide: {
    display: 'none'
  },
  printFrame: {
    position: "fixed",
    left: "0",
    right: "0",
    top: "0",
    bottom: "0",
    backgroundColor: "#fff",
    width: "100%",
    zIndex: "1111",
    height: "100%",
    margin: "auto"
  },
  qrPrintImg: {
    margin: "auto",
    display: "block",
    width: "400px",
    height: "400px"
  },
  customImageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    border: "1px solid #0000000d",
    padding: "4px",
    boxSizing: "border-box",
    flexDirection: "column",
    justifyContent: "space-evenly"
  },
  customImageType2: {
    width: "100%"
  },
  customLabel: {
    width: "100%",
    height: "30px",
    border: "none",
    borderRadius: "unset",
    backgroundColor: "#e0e0e0"
  },
  cos1: {
    backgroundColor: "#eeeeee",
    padding: "15px!important",
    margin: "0 15px 15px"
  },
  flexJustify: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  flexOnly: {
    display: "flex",
    alignItems: "center"
  },
  margin0: {
    margin: "0"
  },
  addIcon: {
    position: 'absolute',
    top: "5px",
    right: "10px"
  },
  deleteIcon: {
    position: 'absolute',
    top: "5px",
    right: "60px"
  },
  absoluteRight: {
    position: 'absolute',
    top: "5px",
    right: "10px"
  },
  moveRight: {
    position: "absolute",
    right: "0"
  },
  required: {
    color: "red"
  },
  margin0:{
    margin:"0"
  }
};

export default profileStyle;
