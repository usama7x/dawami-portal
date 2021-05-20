import React, { useEffect, useState, useMemo } from 'react';
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";


import Lang from '../../variables/lang.json';
import Snackbar from "components/Snackbar/Snackbar.js";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib

import {
    TimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
// form 

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import { useForm, Controller } from "react-hook-form";
import { DateTimePicker } from "@material-ui/pickers";

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});





function AddAttendance({
    close,
    onSubmit,
    formName,
    dateType,
    formType,
    validation,
    checkInDate,
    checkOutDate
}) {
    const classes = useStyles();
    console.log(checkInDate, checkOutDate)
    const { register, handleSubmit, watch, errors, control, setError } = useForm();
    const formSubmit = data => {
        if (data.checkOutDate && data.checkInDate) {
            let timediff = diff_hours(data.checkOutDate, data.checkInDate);
            // debugger;
            if ( validation && (timediff > 24 || timediff < 0)) {
                setError("checkInDate", "Please select a valid range.")
                return false;
            } else {
                data.checkInDate = data.checkInDate.toISOString();
                data.checkOutDate = data.checkOutDate.toISOString();
                onSubmit(data);
            }
        } else {
            setError("checkInDate", "Please select a valid range.")
        }

    };

    const diff_hours = React.useCallback((dt2, dt1) => {

        var diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        return Math.round(diff);

    }, [])

    return (
        <div>
            <h3>
            {
                formName ? formName : Lang.addAttendance
            }
            </h3>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <form onSubmit={handleSubmit(formSubmit)}>
                    <GridContainer style={{ padding: "5px 0" }}>

                        <GridItem xs={12} sm={12} md={5}>
                            <Controller
                                name="checkInDate"
                                control={control}
                                defaultValue={checkInDate}
                                render={({ onChange, value }) => (
                                    <DateTimePicker
                                        autoOk
                                        ampm={false}
                                        disableFuture
                                        value={value}
                                        onChange={onChange}
                                        label="Start Date"
                                    />
                                )}
                            />

                        </GridItem>
                        <GridItem xs={12} sm={12} md={5}>
                            <Controller
                                name="checkOutDate"
                                control={control}
                                defaultValue={checkOutDate}
                                render={({ onChange, value }) => (
                                    <DateTimePicker
                                        autoOk
                                        ampm={false}
                                        disableFuture
                                        value={value}
                                        onChange={onChange}
                                        label="End Date"
                                    />
                                )}
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={2}>
                            <IconButton aria-label="add" type="submit" color="primary">
                                <CheckCircleIcon />
                            </IconButton>
                        </GridItem>
                    </GridContainer>
                    <p>{errors.checkInDate && Lang.validRangeMessage}</p>
                </form>


            </MuiPickersUtilsProvider>


        </div>

    )
}

const AttendanceContainer = (props) => {
    const {
        close,
        formType
    } = props;
    if(formType === "popup") {
        return (
            <div>
                <Dialog open={true} onClose={close} aria-labelledby="form-dialog-title">
                    <DialogContent>
                        <AddAttendance {...props}/>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
    return <AddAttendance {...props}/>
}

export default React.memo(AttendanceContainer)