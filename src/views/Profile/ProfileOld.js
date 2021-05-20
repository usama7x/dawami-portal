import React, { useState, useEffect } from "react";
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
import { appCache, timeZoneList, shiftDataCommon, languageList } from '../../utils/Common.js';
// icon
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
// components
import ShowShiftData from './ShowShiftData';
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
const LocationMap = React.memo(function Map({latitude,longitude,range, classes}) {
  console.log("locationmap");
  console.log(latitude,longitude,range)
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

const CompanyProfile = () => {
  console.log("####################companyprofile")
  const classes = useStyles();
  const [companyData, setCompanyData] = useState({});
  const [qrcodeUrl, setQrcodeUrl] = useState('');
  const [profileData, setProfileData] = useState({});
  const [shiftDataList, setShiftData] = useState([]);
  const [langData, setLangData] = useState([]);
  const [timezoneData, setTimezoneData] = useState([]);
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
  const password = useFormInput('');
  const webSiteUrl = useFormInput('');
  const email = useFormInput('');
  const defaultShiftId = useFormInput("");
  const languageId = useFormInput('');
  const timezoneId = useFormInput('');
  const profileImage = useFormInput('');
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


  const handleSubmit = (event) => {
    event.preventDefault();
    const companyDataL = {
      "orgId": parseInt(appCache('orgId')),
      "name": name.value,
      "logoImagePath": profileImageName.value,
      "qrCode": companyData.qrCode,
      "locationData": {
        "latitude": latitude.value.toString(),
        "longitude": longitude.value.toString(),
        "range": parseInt(range.value)
      },
      "timeZoneId": timezoneId.value,
      "adminUserId": 0,
      "userName": userName.value,
      "passWord": password.value,
      "webSiteUrl": webSiteUrl.value,
      "email": email.value,
      "contactNumber": contactNumber.value,
      "defaultShiftId": defaultShiftId.value,
      "languageId": languageId.value
    }
    updateCompanyProfileApi(companyDataL).then(res => {
      showNotification(Lang.profilePage.successMessage);
      fillProfileForm(companyDataL);
      showNotification(Lang.profileUpdatesMessage);
      setEditProfileFlag(false);
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

  const fillProfileForm = (res) => {
    console.log("fill profile")
    console.log(res);
    setCompanyData(res);
    QRCode.toDataURL(res.qrCode).then(url => {
      setQrcodeUrl(url);
    })
    name.setValue(res.name);
    userName.setValue(res.userName);
    password.setValue(res.passWord);
    webSiteUrl.setValue(res.webSiteUrl);
    email.setValue(res.email);
    contactNumber.setValue(res.contactNumber);
    defaultShiftId.setValue(res.defaultShiftId);
    if (languageId.value != res.languageId) languageId.setValue(res.languageId);
    timezoneId.setValue(res.timeZoneId);
    latitude.setValue(res.locationData.latitude);
    longitude.setValue(res.locationData.longitude);
    range.setValue(res.locationData.range);
    profileImageName.setValue(res.logoImagePath);
    languageList().then(res => {
      setLangData(res)
    });

    getImage(res.logoImagePath).then(res => {
      profileImage.setValue(res);
    });

    shiftDataCommon().then(res => {
      setShiftData(res)
    })

    timeZoneList().then(res => {
      setTimezoneData(res)
    });
    setLoader(false)
  }

  const editProfile = () => {
    setEditProfileFlag(!editProfileFlag);
  }

  const cancelUpdate = () => {
    setEditProfileFlag(!editProfileFlag);
    fillProfileForm(companyData);
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
    const formData = new FormData();
    formData.append("file", e);
    uploadFile(formData).then((res) => {
      profileImageName.setValue(res.data);
      getImage(res.data).then(res => {
        profileImage.setValue(res);
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
        <Button onClick={e => fileInput.current && fileInput.current.click()} color="primary">{Lang.uploadImage}</Button>
      </div>
    )
  }



  useEffect(() => {
    if (printFlag) {
      window.print();
      setPrintFlag(false);
    }
  }, [printFlag])

  useEffect(() => {
    setLoader(true)
    getCompanyData().then(res => {
      res = res.data;
      fillProfileForm(res);
    })
  }, []);

  return (
    <div>
      <div
        className={(!printFlag ? classes.hide : "") + " " + classes.printFrame}>
        <img src={qrcodeUrl} className={classes.qrPrintImg}></img>
      </div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <form>
              <CardHeader color="primary" className={classes.flexJustify}>
                <h4 className={classes.cardTitleWhite}>{Lang.profile}</h4>
                {
                  !editProfileFlag ?
                    <Button color="secondary" onClick={editProfile} size="sm" color="info">{Lang.editProfile}</Button> :
                    <div>
                      <Button type="submit" color="secondary" size="sm" onClick={handleSubmit} color="info">{Lang.submit}</Button>
                      <Button color="secondary" size="sm" onClick={cancelUpdate} color="info">{Lang.cancel}</Button>
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
                    </div>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={8}>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          labelText="Company Name"

                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            value: name.value,
                            onChange: name.onChange,
                            disabled: !editProfileFlag,
                          }}
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
                            value: userName.value
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12} >
                        <div className={classes.flexJustify}>
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
                                <Button onClick={updatePassword} size="sm" color="primary">{Lang.updatePassword}</Button>
                                <Button onClick={canclePasswordUpdate} size="sm" color="primary">{Lang.cancel}</Button>
                              </div> :
                              <Button onClick={editPassword} size="sm" color="primary">{Lang.editPassword}</Button>
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
                        value: webSiteUrl.value,
                        onChange: webSiteUrl.onChange,
                        disabled: !editProfileFlag
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
                        type: "email",
                        value: email.value,
                        onChange: email.onChange,
                        disabled: !editProfileFlag
                      }}
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
                        value: contactNumber.value,
                        onChange: contactNumber.onChange,
                        disabled: !editProfileFlag
                      }}
                    />
                  </GridItem>
                </GridContainer>

                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel id="language-simple-select-helper-label">{Lang.profilePage.language}</InputLabel>
                      <Select
                        labelId="language-simple-select-helper-label"
                        id="language-simple-select-helper"
                        value={languageId.value}
                        onChange={languageId.onChange}
                        disabled={!editProfileFlag}
                      >
                        {
                          langData.map(ele => {
                            return <MenuItem value={ele.languageId} key={"dasdasd" + ele.languageId}>{ele.languageName}</MenuItem>
                          })
                        }
                      </Select>
                      {/* {<FormHelperText>Some important helper text</FormHelperText>} */}
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel id="timezone-simple-select-helper-label">{Lang.profilePage.timezone}</InputLabel>
                      <Select
                        labelId="timezone-simple-select-helper-label"
                        id="timezone-simple-select-helper"
                        value={timezoneId.value}
                        onChange={timezoneId.onChange}
                        disabled={!editProfileFlag}
                      >
                        {
                          timezoneData.map(ele => {
                            return <MenuItem value={ele.id} key={"tz" + ele.id}>{`${ele.description}(${ele.offSetH}:${ele.offSetM})`}</MenuItem>

                          })
                        }
                      </Select>
                      {/* {<FormHelperText>Some important helper text</FormHelperText>} */}
                    </FormControl>

                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel id="demo-simple-select-helper-label">{Lang.defaultShift}</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={defaultShiftId.value}
                        onChange={defaultShiftId.onChange}
                        disabled={!editProfileFlag}
                      >
                        {
                          shiftDataList.map(ele => {
                            return <MenuItem value={ele.shiftId} key={"sssAsd" + ele.shiftId}>{ele.shiftName}</MenuItem>
                          })
                        }
                      </Select>
                      {/* {<FormHelperText>Some important helper text</FormHelperText>} */}
                    </FormControl>

                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText={Lang.latitude}
                      id="latitude"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: latitude.value,
                        onChange: latitude.onChange,
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
                        value: longitude.value,
                        onChange: longitude.onChange,
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
                        value: range.value,
                        onChange: range.onChange,
                        disabled: !editProfileFlag
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>

            </form>
          </Card>
          {/* location */}

          {/* shift */}
         { !editProfileFlag?<Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>{Lang.shiftDetails}</h4>
              {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
            </CardHeader>
            <CardBody>
              <ShowShiftData
                defaultShiftId={defaultShiftId}
                setShiftData={setShiftData}
                shiftDataList={shiftDataList}
              ></ShowShiftData>
            </CardBody>
          </Card>:null}
        </GridItem>

        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>QR CODE</h4>
              {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
            </CardHeader>
            <CardBody>
              <GridContainer>
                <a ref={qrcodeRef} href={qrcodeUrl} className={classes.customImageType1} target="_blank" download={`qrcode_for_${companyData.name}.png`}>
                  <div className={classes.customImageType1} style={{ backgroundImage: `url(${qrcodeUrl})` }}></div>
                </a>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<GetAppRoundedIcon />}
                  onClick={printQr}
                  style={{ margin: "auto" }}
                  color="primary"
                >
                  {Lang.print}
                </Button>
              </GridContainer>
            </CardBody>
          </Card>
          {
            companyData.locationData && (companyData.locationData.latitude && companyData.locationData.longitude && companyData.locationData.range)?
            <LocationMap latitude={companyData.locationData.latitude} longitude={companyData.locationData.longitude} range={companyData.locationData.range} classes={classes}></LocationMap>:
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
  console.log("Profile")
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <CompanyProfile></CompanyProfile>
        </GridItem>
      </GridContainer>
    </div>
  );
}
