import React, { useState, memo, useCallback } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from '@material-ui/core/FormHelperText';
// icons
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import SaveIcon from '@material-ui/icons/Save';
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
// accordian
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Lang from '../../variables/lang.json';
import Snackbar from "components/Snackbar/Snackbar.js";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import CustomIconButton from '../Common/CustomIconButton'
import {
    TimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
// form 

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import styles from "assets/jss/material-dashboard-react/views/profileStyle.js";
import { appCache, timeZoneList, shiftDataCommon, languageList } from '../../utils/Common.js';

//components
import ShiftStrip from "./ShiftStrip";

import {
    addNewShiftApi,
    deleteShiftApi,
    editShiftApi
} from "../../utils/api";

const useStyles = makeStyles(styles);
const useFormInput = initialValue => {
    const [value, setValue] = useState(initialValue);
    const [errorMessage, setErrorMessage] = useState("");
    let errorFlag = false;
    // let errorMessage = "";
    const handleChange = e => {
        setValue(e.target.value);
    }
    return {
        value,
        onChange: handleChange,
        setValue,
        errorMessage,
        setErrorMessage
    }
}
const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];



const ShiftDetails = React.memo(({ shiftLabel, existingShiftRecords, onSave, ExistingShiftData, onDelete, defaultShiftId, closeAddShift }) => {
    console.log("ShiftDetails")
    console.log(ExistingShiftData)
    const classes = useStyles();
    const shiftName = useFormInput(shiftLabel);
    const [panelOpened, setOpenPanel] = useState(closeAddShift?true:false)

    const [shiftRecords, setShiftRecords] = useState(existingShiftRecords ? existingShiftRecords : []);
    const [shiftDataRes, setShiftRes] = useState([]);
    // let shiftDataRes = [];
    const submitShiftData = () => {
        // debugger;
        if (!shiftName.value || !(shiftName.value.length > 2 && shiftName.value.length < 101)) {
            shiftName.setErrorMessage(Lang.shiftNameError)
            return false
        }
        let resData = [];
        // merge existing shift data with new
        let shiftRecordLocalResponse = [];
        days.forEach((element, index) => {
            let localResponse;
            if (existingShiftRecords && existingShiftRecords[index] && shiftDataRes[index]) {
                shiftRecordLocalResponse[index] = shiftDataRes[index]
            } else if (existingShiftRecords && existingShiftRecords[index]) {
                shiftRecordLocalResponse[index] = existingShiftRecords[index];
            } else if (shiftDataRes[index]) {
                shiftRecordLocalResponse[index] = shiftDataRes[index];
            }
        })
        // if (existingShiftRecords) {
        //     shiftDataRes.forEach((ele, index) => {
        //         existingShiftRecords[index] = ele;
        //     });
        //     resData = existingShiftRecords;
        // } else {
        //     resData = shiftDataRes;
        // }

        if (shiftRecordLocalResponse.length === 0) {
            shiftName.setErrorMessage(Lang.shiftNotSet)
            return false
        }
        let data;
        if (ExistingShiftData) {
            data = {
                shiftName: shiftName.value,
                shiftRecords: converToUtc(shiftRecordLocalResponse),
                shiftId: ExistingShiftData.shiftId
            }
        } else {
            data = {
                orgId: parseInt(appCache('orgId')),
                shiftName: shiftName.value,
                shiftRecords: converToUtc(shiftRecordLocalResponse),
            }
        }
        debugger;
        // return;
        onSave(data);
    }

    const converToUtc = e => {
        e = e.filter(e => e && e.shiftStartTime && e.shiftEndTime);
        return e.map(ele => {
            let shiftStime = `${ele.shiftStartTime.getUTCHours()}:${ele.shiftStartTime.getUTCMinutes()}:00`;
            let shiftEtime = `${ele.shiftEndTime.getUTCHours()}:${ele.shiftEndTime.getUTCMinutes()}:00`;
            return {
                ...ele,
                shiftStartTime: shiftStime,
                shiftEndTime: shiftEtime
            }
        })
    }
    const copyShiftToAll = useCallback(
        (localshiftData) => {
            const shifArr = days.map((element, index) => {
                let dataToReturn = {
                    ...localshiftData,
                    shiftDay: index,
                }
                if (shiftRecords[index] && shiftRecords[index].shiftRecordId) {
                    dataToReturn.shiftRecordId = shiftRecords[index].shiftRecordId
                }
                return dataToReturn;
            })
            // shiftDataRes.forEach((ele, index) => {
            //     existingShiftRecords[index] = ele;
            // });
            console.log("copy shift to all", shifArr)
            setShiftRecords(shifArr);
            setShiftRes(shifArr);
        },
        [],
    )
    const getShiftData = (index, shift) => {

        let temp = [...shiftDataRes];
        temp[index] = shift;
        setShiftRes(temp)
        // debugger;
        console.log("getShiftData", index);
        console.log(shiftDataRes);
    };
    return (
        <ExpansionPanel expanded={panelOpened} onChange={()=>setOpenPanel(!panelOpened)}>
            <ExpansionPanelSummary
                expandIcon={closeAddShift?null:<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id={`panel1a-header${shiftLabel}`}

            >
                <div className={classes.flexJustify} style={{ width: "100%", margin:"0" }} onClick={(e)=>e.stopPropagation()}>
                    <CustomInput
                        labelText={Lang.shiftName}

                        formControlProps={{
                            fullWidth: true,
                            className: classes.margin0
                        }}
                        inputProps={{
                            type: "text",
                            value: shiftName.value,
                            onChange: shiftName.onChange,
                        }}
                        helperText={shiftName.errorMessage}
                        
                    />
                    <div style={{display:"flex"}}>
                        {
                            ExistingShiftData && defaultShiftId.value != ExistingShiftData.shiftId && shiftName.value !== "Default"?
                                <Tooltip title="Delete" >
                                    <IconButton aria-label="delete" onClick={(e) => { e.stopPropagation(); onDelete(ExistingShiftData.shiftId) }}>
                                        <DeleteIcon style={{ color: "#ff0000" }} />
                                    </IconButton>
                                </Tooltip>
                                : ''
                        }
                        <Tooltip title="Save" aria-label="add" >
                            <IconButton aria-label="delete" onClick={(e) => { e.stopPropagation(); submitShiftData() }}>
                                <SaveIcon style={{ color: "#a844ba" }} />
                            </IconButton>
                        </Tooltip>
                        {
                            closeAddShift && <CustomIconButton onClick={closeAddShift} title={Lang.close} icon="clear" className={classes.closeIcon} />
                        }
                    </div>
                </div>


            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ display: "block" }}>
                {
                    panelOpened ?
                        days.map((ele, index) => {
                            console.log("loop", index)
                            return (
                                <ShiftStrip
                                    index={index}
                                    startTime={shiftRecords[index] ? shiftRecords[index].shiftStartTime : null}
                                    endTime={shiftRecords[index] ? shiftRecords[index].shiftEndTime : null}
                                    getShift={getShiftData}
                                    shiftRecordId={shiftRecords[index] ? shiftRecords[index].shiftRecordId : null}
                                    copyToAllMain={copyShiftToAll}
                                ></ShiftStrip>
                            )
                        }) : null
                }
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
});


const ShowShiftData = memo(({ setShiftData, defaultShiftId, existingShiftDataList, showAddShift, closeAddShift }) => {
    console.log("ShowShiftData");
    console.log(existingShiftDataList);
    const [openLoader, setLoader] = useState(false);
    const [open, setOpen] = useState(false);
    const [place, setPlace] = useState("tr");
    const [color, setColor] = useState("info");
    const [snakMessage, setSnakMessage] = useState("");
    const classes = useStyles();

    const showNotification = (message) => {
        setSnakMessage(message);
        setOpen(true);
        setTimeout(() => {
            setOpen(false)
        }, 3000)
    }
    const deleteShift = (shiftId) => {
        setLoader(true);
        deleteShiftApi(shiftId).then(res => {
            shiftDataCommon(true).then(res => {
                setShiftData(res);
                setLoader(false);
            })
        }).catch(err => {
            if (err && err.response && err.response.data && err.response.data.error) {
                showNotification(err.response.data.error);
            } else {
                showNotification(Lang.keySomethingWentWrong);
            }
        }).then(e => {
            setLoader(false);
        })
    }

    const addShift = (data) => {
        setLoader(true);
        addNewShiftApi(data).then(res => {
            shiftDataCommon(true).then(res => {
                setShiftData(res);
                showNotification(Lang.dataSaved);
                setLoader(false);
            });

        }).catch(err => { }).then(e => {
            setLoader(false);
            showNotification(Lang.keySomethingWentWrong)
        });
    }

    const editShift = (data) => {
        setLoader(true);
        console.log(existingFilteredShiftList)
        debugger
        editShiftApi(data).then(res => {
            debugger
            shiftDataCommon(true).then(res => {
                setShiftData(res);
                setLoader(false);
                showNotification(Lang.dataSaved);
            });
        }).catch(err => {
            setLoader(false);
            showNotification(Lang.keySomethingWentWrong)
        })
    }
    const existingFilteredShiftList = React.useMemo(() => {
        return existingShiftDataList.map(ele => {
            return {
                ...ele,
                shiftRecords: ele.shiftRecords.map(rec => {
                    return {
                        ...rec,
                        shiftEndTime: new Date((new Date()).setHours(...rec.shiftEndTime.split(":"))),
                        shiftStartTime: new Date((new Date()).setHours(...rec.shiftStartTime.split(":")))
                    }
                })
            }
        })
    }, [existingShiftDataList])
    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Backdrop className={classes.backdrop} open={openLoader} style={{ zIndex: "11111" }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <GridContainer  >
                <GridItem xs={12} sm={12} md={12} >
                    {
                        showAddShift &&
                        <ShiftDetails
                            shiftLabel={Lang.addNewShift}
                            onSave={addShift}
                            closeAddShift={closeAddShift}
                        ></ShiftDetails>
                    }
                    {existingFilteredShiftList.map((ele, index) => {
                        let shiftRecords = [];
                        ele.shiftRecords.forEach(item => {
                            shiftRecords[item.shiftDay] = item;
                        });
                        // return <AddShift ExistingShiftData={ele}/>
                        return (
                            <ShiftDetails
                                shiftLabel={ele.shiftName}
                                existingShiftRecords={shiftRecords}
                                onSave={editShift}
                                ExistingShiftData={ele}
                                key={"dasdas" + index}
                                onDelete={deleteShift}
                                // ShiftDetails={ShiftDetails}
                                defaultShiftId={defaultShiftId}
                            ></ShiftDetails>
                        )
                    })}
                    <Divider variant="middle" />
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
        </MuiPickersUtilsProvider>
    )
});

export default ShowShiftData;
// export const ShowShiftData = React.memo(ShowShiftData1);