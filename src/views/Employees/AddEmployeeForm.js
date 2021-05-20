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
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
// import Card from "components/Card/Card.js";
// import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
// import CardBody from "components/Card/CardBody.js";
// import CardFooter from "components/Card/CardFooter.js";
import InputLabel from "@material-ui/core/InputLabel";
import Lang from '../../variables/lang.json';
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import { setUserSession, setAppCache, appCache, shiftDataCommon, getData } from '../../utils/Common.js';
import styles from "assets/jss/material-dashboard-react/views/employeesStyle.js";
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';
import { RssFeed } from "@material-ui/icons";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { getEmployees } from '../../utils/api.js'
import CloseIcon from '@material-ui/icons/Close';
import { useForm, Controller } from "react-hook-form";
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FileUploader from "views/Common/FileUploader";
import FormHelperText from '@material-ui/core/FormHelperText';
const useStyles = makeStyles(styles);

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState("");
  let errorFlag = false;
  // let errorMessage = "";
  const handleChange = e => {
    // debugger;
    setValue(e.target.value);
    // console.log(e.target.id);
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



function AddEmployeeForm({ updateEmpList, close }) {
  const styl = {
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
    }
  };
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  // form data
  const firstName = useFormInput('');
  const lastName = useFormInput('');
  const email = useFormInput('');
  const address = useFormInput('');
  const mobile = useFormInput('');
  const hourRate = useFormInput("");
  const shift = useFormInput('');
  //notification hooks
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState("tr");
  const [color, setColor] = useState("info");
  const [error, setError] = useState(null);
  const [shiftDataList, setShiftDataList] = useState([]);
  const [profileImage, setprofileImage] = useState({
    value: ''
  });
  const { register, handleSubmit, watch, errors, control, reset, setValue } = useForm();
  const onSubmit = (data) => {
    // const empData = {
    //   "orgId": parseInt(appCache('orgId')),
    //   "firstName": firstName.value,
    //   "lastName": lastName.value,
    //   "email": email.value,
    //   "shiftId": parseInt(shift.value),
    //   "mobile": parseInt(mobile.value),
    //   "hourRate": parseInt(hourRate.value),
    //   "address": address.value
    // }
    data.orgId = parseInt(appCache('orgId'));
    data.shiftId = parseInt(data.shiftId);
    data.hourRate = parseInt(data.hourRate);
    data.mobile = parseInt(data.mobile);
    // validation check

    const submitData = async () => {
      const result = await axios.post(
        api.addUser,
        data, {
        // params:empData,
        headers: config.headers
      }
      ).then(response => {
        const msg = `Data Saved. Employee ID: ${response.data}`;
        showNotification(msg);
        updateEmpList();
        reset();
      }).catch((err) => {
        debugger;
        showNotification(err && err.response.data.error ? err.response.data.error : Lang.keySomethingWentWrong);
      });
    }
    submitData();
  }
  //notification handler
  const imageUpload = useCallback(
    (imageName, imageDataUrl) => {
      setprofileImage({ value: imageDataUrl });
      setValue("profileImage", imageName);
      console.log(imageName);
    },
    [],
  )
  const showNotification = (message) => {
    setError(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false)
    }, 5000)
  }
  useEffect(() => {
    shiftDataCommon().then(res => {
      setShiftDataList(res);
    })

  }, []);

  return (
    <div>
      <Snackbar
        place={place}
        color={color}
        icon={AddAlert}
        message={error}
        open={open}
        closeNotification={() => setOpen(false)}
        close
      />
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <CardBody>
                <Tooltip title={Lang.close} style={{ float: "right" }}>
                  <IconButton aria-label="add" onClick={() => close()}>
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
                <h4>Add Employee Details</h4>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <div className={classes.customImageContainer}>
                      <img className={classes.customImageType2} src={profileImage.value} />
                      <FileUploader onSuccess={imageUpload} />
                      <input type="hidden" name="profileImage" ref={register} />
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={8}>
                    <GridItem xs={12} sm={12} md={12}>
                      <div className={classes.positionRelative}>
                        <CustomInput
                          labelText="First Name"
                          id="firstName"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            inputRef: register({ required: "Name Required", minLength: 3, maxLength: 100 }),
                            name: "firstName"
                          }}
                          helperText={errors.firstName && Lang.nameError}
                        />
                        <span className={classes.requiredSign + " " + classes.marginTop30}>*</span>
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      <div className={classes.positionRelative}>
                        <CustomInput
                          labelText="Last Name"
                          id="lastName"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            inputRef: register({ required: "Name Required", minLength: 3, maxLength: 100 }),
                            name: "lastName"
                          }}
                          helperText={errors.lastName && Lang.nameError}
                        />
                        <span className={classes.requiredSign + " " + classes.marginTop30}>*</span>
                      </div>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={12}>
                      <CustomInput
                        labelText="Email address"
                        id="email"
                        formControlProps={{
                          fullWidth: true,

                        }}
                        helperText={errors.email && Lang.invalidEmail}
                        inputProps={{
                          inputRef: register({ minLength: 3, maxLength: 100, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i }),
                          name: "email"
                        }}
                      />
                    </GridItem>

                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={8}>
                    <CustomInput
                      labelText="Address"
                      id="address"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        inputRef: register({ minLength: 3, maxLength: 100 }),
                        name: "address"
                      }}
                      helperText={errors.address && Lang.addressError}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <div className={classes.positionRelative}>
                      <CustomInput
                        labelText="Mobile"
                        id="mobile"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          inputRef: register({
                            required: true, minLength: 6, maxLength: 20, pattern: {
                              value: /^[+]?[0-9]+$/i,
                              message: Lang.invalidNumber
                            }
                          }),
                          name: "mobile",
                        }}
                        helperText={errors.mobile && Lang.invalidNumber}
                      />
                      <span className={classes.requiredSign + " " + classes.marginTop30}>*</span>
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <div className={classes.positionRelative}>
                      <CustomInput
                        labelText="Hour Rate"

                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          inputRef: register({ required: true, minLength: 1, maxLength: 3, pattern: /^[0-9]+$/i }),
                          name: "hourRate",
                        }}

                        helperText={errors.hourRate && Lang.hourRateError}
                      />
                      <span className={classes.requiredSign + " " + classes.marginTop30}>*</span>
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl style={{
                      paddingBottom: "10px",
                      margin: "27px 0 0 0"
                    }} className={classes.formControl} fullWidth>
                      <InputLabel id="demo-simple-select-helper-label">{Lang.profilePage.shiftTime}</InputLabel>
                      <Controller
                        name="shiftId"
                        control={control}
                        rules={{ required: true }}
                        render={
                          ({ value, onChange, onBlur }) => (
                            <Select
                              labelId="demo-simple-select-helper-label"
                              id="demo-simple-select-helper"
                              value={value}
                              onChange={onChange}
                              onBlur={onBlur}
                            >
                              {
                                shiftDataList.map(ele => {
                                  return <MenuItem value={ele.shiftId}>{ele.shiftName}</MenuItem>
                                })
                              }
                            </Select>
                          )
                        }
                      />

                      {
                        errors && errors.shiftId && <FormHelperText style={{ fontSize: "11px" }}>Shift Time is required</FormHelperText>
                      }
                      <span className={classes.requiredSign}>*</span>
                    </FormControl>

                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary" type="submit">Add Employee</Button>
              </CardFooter>
            </Card>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  )
}
export default AddEmployeeForm = React.memo(AddEmployeeForm);