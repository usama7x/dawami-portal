import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Lang from '../../variables/lang.json';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
    DateTimePicker,
    DatePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import IconButton from '@material-ui/core/IconButton';
import { useForm, Controller } from "react-hook-form";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from "prop-types";

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
    startDate,
    endDate,
    dateOnly
}) {
    const classes = useStyles();

    const { register, handleSubmit, watch, errors, control, setError } = useForm();
    const formSubmit = data => {
        if (data.checkOutDate && data.checkInDate) {
            let timediff = diff_hours( data.checkOutDate, data.checkInDate);
            if ( validation && (timediff < 0)) {
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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <form onSubmit={handleSubmit(formSubmit)}>
                    <GridContainer style={{ padding: "5px 0" }}>

                        <GridItem xs={12} sm={12} md={5}>
                            <Controller
                                name="checkInDate"
                                control={control}
                                defaultValue={startDate}
                                render={({ onChange, value }) => (
                                    dateOnly ?
                                    <DatePicker
                                        autoOk
                                        ampm={false}
                                        disableFuture
                                        value={value}
                                        onChange={onChange}
                                        label="Start Date"
                                    />:
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
                                defaultValue={endDate}
                                render={({ onChange, value }) => (
                                    dateOnly?
                                    <DatePicker
                                        autoOk
                                        ampm={false}
                                        disableFuture
                                        value={value}
                                        onChange={onChange}
                                        label="End Date"
                                    />:
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

AddAttendance.propTypes = {
    dateOnly: PropTypes.bool
}

export default React.memo(AttendanceContainer)
