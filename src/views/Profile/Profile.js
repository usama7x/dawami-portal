import React, { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";

// icons
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import Chip from '@material-ui/core/Chip';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { TextField } from '@material-ui/core';
import Lang from '../../variables/lang.json';
import Snackbar from "components/Snackbar/Snackbar.js";

// form 
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import QRCode from 'qrcode';
import { appCache, timeZoneList, shiftDataCommon, languageList, setAppCache } from '../../utils/Common.js';
import IconButton from '@material-ui/core/IconButton';
// icon
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import EditIcon from '@material-ui/icons/Edit';
import CustomIconButton from '../Common/CustomIconButton'
// components
import ShowShiftData from './ShowShiftData';
import Loader from "../Common/Loader";
// api
import {
  getCompanyData,
  getImage,
  updatePassordApi,
  uploadFile,
  updateCompanyProfileApi,
} from "../../utils/api";
import styles from "assets/jss/material-dashboard-react/views/profileStyle.js";
// import UserProfile from "views/UserProfile/UserProfile.js";

// map
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle
} from "react-google-maps";

const useStyles = makeStyles(styles);
const LocationMap = React.memo(function Map({ latitude, longitude, range, classes }) {
  console.log("locationmap");
  console.log(latitude, longitude, range)
  latitude = parseFloat(latitude);
  longitude = parseFloat(longitude);
  range = parseInt(range);
  const CustomSkinMap = React.memo(withScriptjs(
    withGoogleMap((props) => (
      <GoogleMap
        defaultZoom={13}
        defaultCenter={{ lat: props.lat, lng: props.lng }}
        defaultOptions={{
          scrollwheel: false,
          zoomControl: true,
          styles: [
            {
              featureType: "water",
              stylers: [
                { saturation: 43 },
                { lightness: -11 },
                { hue: "#0088ff" }
              ]
            },
            {
              featureType: "road",
              elementType: "geometry.fill",
              stylers: [
                { hue: "#ff0000" },
                { saturation: -100 },
                { lightness: 99 }
              ]
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#808080" }, { lightness: 54 }]
            },
            {
              featureType: "landscape.man_made",
              elementType: "geometry.fill",
              stylers: [{ color: "#ece2d9" }]
            },
            {
              featureType: "poi.park",
              elementType: "geometry.fill",
              stylers: [{ color: "#ccdca1" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [{ color: "#767676" }]
            },
            {
              featureType: "road",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#ffffff" }]
            },
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            {
              featureType: "landscape.natural",
              elementType: "geometry.fill",
              stylers: [{ visibility: "on" }, { color: "#b8cb93" }]
            },
            { featureType: "poi.park", stylers: [{ visibility: "on" }] },
            {
              featureType: "poi.sports_complex",
              stylers: [{ visibility: "on" }]
            },
            { featureType: "poi.medical", stylers: [{ visibility: "on" }] },
            {
              featureType: "poi.business",
              stylers: [{ visibility: "simplified" }]
            }
          ]
        }}
      >
        <Marker position={{ lat: props.lat, lng: props.lng }} />
        <Circle radius={props.range} center={{ lat: props.lat, lng: props.lng }} />
      </GoogleMap>
    ))
  ));
  return (
    <Card>
      <CardHeader color="primary">
        <h4 className={classes.cardTitleWhite}>{Lang.location}</h4>
        {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
      </CardHeader>
      <CardBody>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <CustomSkinMap
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBV5yNbA3uXq9v1gAiZcOIp8Dil1RjyVec"
              loadingElement={<div style={{ height: `50%` }} />}
              containerElement={<div style={{ height: `50vh` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              lat={latitude}
              lng={longitude}
              range={range}
            />
          </GridItem>
        </GridContainer>
      </CardBody>
    </Card>
  )
})

const CompanyProfile = ({ profileData, getProfileDataFun }) => {
  console.log("companyprofile")
  const classes = useStyles();
  const { register, handleSubmit, watch, errors, control, setValue, reset, getValues } = useForm({
    defaultValues: {
      ...profileData
    }
  });
  const [companyData, setCompanyData] = useState({});
  const [shiftDataList, setShiftData] = useState(profileData.shiftDataList);
  const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    const handleChange = React.useCallback(e => {
      setValue(e.target.value);
      console.log(e.target.value);
    })
    return {
      value,
      onChange: handleChange,
      setValue
    }
  }
  // form data
  const name = useFormInput('');
  const userName = useFormInput('');
  const password = useFormInput(profileData.passWord);
  const webSiteUrl = useFormInput('');
  const email = useFormInput('');
  const defaultShiftId = useFormInput("");
  const languageId = useFormInput('');
  const timezoneId = useFormInput('');
  const profileImage = useFormInput(profileData.profileImage);
  const profileImageName = useFormInput('');
  const contactNumber = useFormInput('');
  const latitude = useFormInput('');
  const longitude = useFormInput('');
  const range = useFormInput('');
  // form data ends here

  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState("tr");
  const [color, setColor] = useState("info");
  const [snakMessage, setSnakMessage] = useState("");
  const [printFlag, setPrintFlag] = useState(false);
  const qrcodeRef = React.useRef();
  const [editPasswordFlag, setEditPasswordFlag] = useState(false);
  const [editProfileFlag, setEditProfileFlag] = useState(false);
  const [showShiftContainer, setShowShiftContainer] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [openLoader, setLoader] = useState(false);
  const [showAddShift, setshowAddShift] = useState(false);

  const profileSubmit = (data) => {
    data.locationData.range = data.locationData.range ? parseInt(data.locationData.range) : null;
    data.orgId = parseInt(appCache('orgId'));
    setLoader(true)
    updateCompanyProfileApi(data).then(res => {
      showNotification(Lang.profilePage.successMessage);
      setLoader(false);
      setEditProfileFlag(false);
      getProfileDataFun()
    });
  }
  // map

  const showNotification = (message) => {
    setSnakMessage(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false)
    }, 3000)
  }

  const printQr = () => {
    setPrintFlag(true);
  }

  const editProfile = () => {
    setEditProfileFlag(!editProfileFlag);
  }

  const cancelUpdate = () => {
    setEditProfileFlag(!editProfileFlag);
    // fillProfileForm(companyData);
    reset(profileData)
  }

  const updatePassword = () => {
    updatePassordApi(password.value).then(res => {
      if (res.data) {
        showNotification(Lang.passwordUpdateMessage);
        setEditPasswordFlag(false);
        setCompanyData({
          ...companyData,
          passWord: password.value
        });
        setPasswordType("password");
      }
    });
  }
  const editPassword = () => {
    setEditPasswordFlag(true);
    setPasswordType("text");
  }
  const canclePasswordUpdate = () => {
    setEditPasswordFlag(false);
    password.setValue(companyData.passWord);
    setPasswordType("password");
  }

  const uploadProfilePhoto = (e) => {
    // debugger;
    if(e && (e.size > 1000 * 1024)) {
      return;
    }
    setLoader(true);
    const formData = new FormData();
    formData.append("file", e);
    uploadFile(formData).then((res) => {
      profileImageName.setValue(res.data);
      setValue("logoImagePath", res.data);
      // setValue("profileImage",getImage(res.data))
      getImage(res.data).then(res => {
        profileImage.setValue(res);
        setLoader(false);
      })
    })
      .catch((err) => console.log("File Upload Error"));
  }
  const FileUploader = ({ onFileSelect }) => {
    const fileInput = React.useRef(null)

    const handleFileInput = (e) => {
      // handle validations
      onFileSelect(e.target.files[0])
    }

    return (
      <div className="file-uploader">
        <input type="file" onChange={handleFileInput} ref={fileInput} style={{ display: "none" }} accept="image/*" />
        <Button style={{display:"block", lineHeight:"10px"}} onClick={e => fileInput.current && fileInput.current.click()} color="primary">{Lang.uploadImage} <br/><strong style={{fontSize:"8px"}}>max size 1mb</strong></Button>
      </div>
    )
  }



  useEffect(() => {
    if (printFlag) {
      window.print();
      setPrintFlag(false);
    }
  }, [printFlag])

  return (
    <div>
      <div
        className={(!printFlag ? classes.hide : "") + " " + classes.printFrame}>
        <img src={profileData.qrcodeUrl} className={classes.qrPrintImg}></img>
      </div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <form onSubmit={handleSubmit(profileSubmit)}>
              <CardHeader color="primary" className={classes.flexJustify}>
                <h4 className={classes.cardTitleWhite}>{Lang.profile}</h4>
                {
                  !editProfileFlag ?
                    <CustomIconButton onClick={editProfile} title={Lang.editProfile} icon="edit" color="invert" size="small" /> :
                    <div>
                      <CustomIconButton title={Lang.submit} type="submit" icon="save" color="invert" size="small" />
                      <CustomIconButton onClick={cancelUpdate} title={Lang.cancel} icon="clear" color="invert" size="small" />
                    </div>
                }
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <div className={classes.customImageContainer}>
                      <img className={classes.customImageType2} src={profileImage.value} />
                      {
                        editProfileFlag ?
                          <FileUploader onFileSelect={uploadProfilePhoto} /> : ""
                      }
                      <input type="hidden" name="logoImagePath" ref={register} />
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={8}>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          labelText={Lang.companyName}

                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            disabled: !editProfileFlag,
                            inputRef: register({ required: "Name Required", minLength: 3, maxLength: 100 }),
                            name: "name"
                          }}
                          helperText={errors.name && Lang.companynameLengthError}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          labelText="Username"
                          id="username"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            disabled: true,
                            value: profileData.userName
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} >
                        <div className={classes.flexOnly}>
                          <CustomInput
                            labelText="Password"
                            id="password"
                            formControlProps={{
                              // fullWidth: true
                            }}
                            inputProps={{
                              type: passwordType,
                              value: password.value,
                              onChange: password.onChange,
                              disabled: !editPasswordFlag
                            }}
                          />
                          {
                            editPasswordFlag ?
                              <div>
                                <CustomIconButton onClick={updatePassword} title={Lang.updatePassword} icon="save" size="small" />
                                <CustomIconButton onClick={canclePasswordUpdate} title={Lang.cancel} icon="clear" size="small" />
                              </div> :
                              editProfileFlag &&<CustomIconButton onClick={editPassword} title={Lang.editPassword} icon="edit" size="small" />
                          }
                        </div>

                      </GridItem>
                    </GridContainer>

                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Website"
                      id="website"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        disabled: !editProfileFlag,
                        inputRef: register({ minLength: 5, maxLength: 100 }),
                        name: "webSiteUrl"
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText={Lang.profilePage.email}
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "text",
                        inputRef: register({
                          minLength: 3, maxLength: 100, pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: Lang.invalidEmail
                          }
                        }),
                        name: "email",
                        disabled: !editProfileFlag
                      }}
                      helperText={errors.email && Lang.invalidEmail}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText={Lang.contactNumber}
                      id="contactNumber"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        inputRef: register({
                          minLength: 6, maxLength: 20, pattern: {
                            value: /^[+]?[0-9]+$/i,
                            message: Lang.invalidNumber
                          }
                        }),
                        name: "contactNumber",
                        disabled: !editProfileFlag
                      }}
                      helperText={errors.contactNumber && Lang.invalidNumber}
                    />
                  </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel id="language-simple-select-helper-label">{Lang.profilePage.language}</InputLabel>
                      <Controller
                        name="languageId"
                        control={control}
                        render={
                          ({ value, onChange, onBlur }) => (
                            <Select
                              labelId="language-simple-select-helper-label"
                              id="language-simple-select-helper"
                              value={value}
                              disabled={!editProfileFlag}
                              onChange={onChange}
                              onBlur={onBlur}
                            >
                              {
                                profileData.langData.map(ele => {
                                  return <MenuItem value={ele.languageId} key={"dasdasd" + ele.languageId}>{ele.languageName}</MenuItem>
                                })
                              }
                            </Select>
                          )
                        }
                      />
                      {/* {<FormHelperText>Some important helper text</FormHelperText>} */}
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel id="timezone-simple-select-helper-label">{Lang.profilePage.timezone}</InputLabel>
                      <Controller
                        name="timeZoneId"
                        control={control}
                        render={
                          ({ value, onChange, onBlur }) => (
                            <Select
                              labelId="timezone-simple-select-helper-label"
                              id="timezone-simple-select-helper"
                              value={value}
                              onChange={onChange}
                              disabled={!editProfileFlag}
                              onBlur={onBlur}
                            >
                              {
                                profileData.timezoneData.map(ele => {
                                  return <MenuItem value={ele.id} key={"tz" + ele.id}>{`${ele.description}(${ele.offSetH}:${ele.offSetM})`}</MenuItem>

                                })
                              }
                            </Select>
                          )
                        }
                      />

                      {/* {<FormHelperText>Some important helper text</FormHelperText>} */}
                    </FormControl>

                  </GridItem>
                  {/* <GridItem xs={12} sm={12} md={4}>
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel id="demo-simple-select-helper-label">{Lang.defaultShift}</InputLabel>
                      <Controller
                        name="defaultShiftId"
                        control={control}
                        render={
                          ({ value, onChange, onBlur }) => (
                            <Select
                              labelId="demo-simple-select-helper-label"
                              id="demo-simple-select-helper"
                              value={value}
                              onChange={onChange}
                              disabled={!editProfileFlag}
                              onBlur={onBlur}
                            >
                              {
                                shiftDataList.map(ele => {
                                  return <MenuItem value={ele.shiftId} key={"sssAsd" + ele.shiftId}>{ele.shiftName}</MenuItem>
                                })
                              }
                            </Select>
                          )
                        }
                      />
                    </FormControl>
                  </GridItem> */}
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText={Lang.latitude}

                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        inputRef: register({ maxLength: 100 }),
                        name: "locationData.latitude",
                        disabled: !editProfileFlag
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText={Lang.longitude}
                      id="longitude"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        inputRef: register({ maxLength: 100 }),
                        name: "locationData.longitude",
                        disabled: !editProfileFlag
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText={Lang.range}
                      id="range"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        inputRef: register({
                          maxLength: 3
                        }),
                        name: "locationData.range",
                        disabled: !editProfileFlag
                      }}
                      helperText={errors.locationData&&errors.locationData.range && Lang.maxRangeError}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>

            </form>
          </Card>
          {/* location */}

          {/* shift */}
          {!editProfileFlag ? <Card>
            <CardHeader color="primary">
              <div className={classes.flexJustify}>
                <h4 className={classes.cardTitleWhite}>{Lang.shiftDetails}</h4>
                <CustomIconButton icon="add" title={Lang.addShift} onClick={() => setshowAddShift(true)} color="invert"/>
              </div>
            </CardHeader>
            <CardBody>
              <ShowShiftData
                defaultShiftId={parseInt(watch('defaultShiftId'))}
                setShiftData={setShiftData}
                existingShiftDataList={shiftDataList}
                showAddShift={showAddShift}
                closeAddShift={() => setshowAddShift(false)}
              ></ShowShiftData>
            </CardBody>
          </Card> : null}
        </GridItem>

        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="primary" className={classes.flexJustify}>
              <h4 className={classes.cardTitleWhite}>QR CODE</h4>
              {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
              <CustomIconButton onClick={printQr} title={Lang.print} icon="print" color="invert" size="small" />
            </CardHeader>
            <CardBody>
              <GridContainer>
                <a ref={qrcodeRef} href={profileData.qrcodeUrl} className={classes.customImageType1} target="_blank" download={`qrcode_for_${profileData.name}.png`}>
                  <div className={classes.customImageType1} style={{ backgroundImage: `url(${profileData.qrcodeUrl})` }}></div>
                </a>

                {/* <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<GetAppRoundedIcon />}
                  onClick={printQr}
                  style={{ margin: "auto" }}
                  color="primary"
                >
                  {Lang.print}
                </Button> */}
              </GridContainer>
            </CardBody>
          </Card>
          {
            profileData.locationData && (profileData.locationData.latitude && profileData.locationData.longitude && profileData.locationData.range) ?
              <LocationMap latitude={profileData.locationData.latitude} longitude={profileData.locationData.longitude} range={profileData.locationData.range} classes={classes}></LocationMap> :
              null
          }
        </GridItem>
      </GridContainer>
      <Snackbar
        place={place}
        color={color}
        // icon={AddAlert}
        message={snakMessage}
        open={open}
        closeNotification={() => setOpen(false)}
        close
      />
      <Backdrop className={classes.backdrop} open={openLoader} style={{ zIndex: "11111" }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default function Profile() {
  const [profileData, setProfileData] = useState();
  const [setLoaderFlag,setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [snakMessage, setSnakMessage] = useState("");
  const [place, setPlace] = useState("tr");
  const [color, setColor] = useState("info");
  const showNotification = (message) => {
    setSnakMessage(message);
    setOpen(true);
    setTimeout(() => {
      setOpen(false)
    }, 3000)
  }
  const getProfileDataFun = useCallback(
    () => {
      getCompanyData().then(async res => {
        let pdata = res.data;
        pdata.qrcodeUrl = await QRCode.toDataURL(pdata.qrCode);
        pdata.langData = await languageList();
        pdata.timezoneData = await timeZoneList();
        pdata.shiftDataList = await shiftDataCommon();
        pdata.profileImage = await getImage(pdata.logoImagePath);
        setAppCache("orgName", pdata.name);
        setProfileData(pdata);
        setLoader(false)
      }).catch(err => {
          // if(err.message){
          //   showNotification(err.message)
          // }else {
          //   showNotification(Lang.keySomethingWentWrong);
          // }
        setLoader(false)
      }) 
    },
    [],
  )
  useEffect(() => {
    setLoader(true);
    getProfileDataFun();
  }, []);
  console.log("Profile")
  return (
    <div>
      <GridContainer>
      <Snackbar
        place={place}
        color={color}
        // icon={AddAlert}
        message={snakMessage}
        open={open}
        closeNotification={() => setOpen(false)}
        close
      />
        <Loader showLoader={setLoaderFlag}/>
        <GridItem xs={12} sm={12} md={12}>
          {profileData && <CompanyProfile profileData={profileData} getProfileDataFun={getProfileDataFun}></CompanyProfile>}
        </GridItem>
      </GridContainer>
    </div>
  );
}
