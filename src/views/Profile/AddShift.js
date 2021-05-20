import React, { useState, memo, useCallback } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";


// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";


import Lang from '../../variables/lang.json';
import CustomIconButton from '../Common/CustomIconButton';
import {
    TimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import styles from "assets/jss/material-dashboard-react/views/profileStyle.js";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import Chip from '@material-ui/core/Chip';

const days = [
    
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

const useStyles = makeStyles(styles);


const ShiftStrip = memo(({
    index,
    control,
    shiftData,
    copyToAll,
    reset,
    err,
    register
}) => {
    console.log("ShiftStrip")
    console.log(err && err.shiftRecords);
    const classes = useStyles();
    return (
        <GridContainer style={{ padding: "5px 0" }} key={`days${index}`}>
            <GridItem xs={12} sm={12} md={4} style={{ alignItems: "flex-end", display: "flex" }}>
                <Chip label={days[index]} className={classes.customLabel} />
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
                <Controller
                    name={`shiftRecords[${index}].shiftStartTime`}
                    control={control}
                    defaultValue={
                        shiftData &&
                            shiftData.shiftRecords &&
                            shiftData.shiftRecords[index] ?
                            shiftData.shiftRecords[index].shiftStartTime :
                            null
                    }
                    // rules={{ customError: true }}
                    render={({ onChange, value }) => (
                        <TimePicker
                            autoOk
                            ampm={false}
                            disableFuture
                            value={value}
                            onChange={onChange}
                            label="Start Date"
                        />
                    )}
                />
                <span>
                    {
                        err && err.shiftRecords && err.shiftRecords[index] && err.shiftRecords[index].message
                    }
                </span>
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
                <Controller
                    name={`shiftRecords[${index}].shiftEndTime`}
                    control={control}
                    defaultValue={
                        shiftData &&
                            shiftData.shiftRecords &&
                            shiftData.shiftRecords[index] ?
                            shiftData.shiftRecords[index].shiftEndTime : null
                    }

                    render={({ onChange, value }) => (
                        <TimePicker
                            autoOk
                            ampm={false}
                            disableFuture
                            value={value}
                            onChange={onChange}
                            label="End Date"
                        />
                    )}
                />
                <span>
                    {
                        err && err.shiftRecords && err.shiftRecords[index] && err.shiftRecords[index].message
                    }
                </span>
            </GridItem>
            <GridItem xs={12} sm={12} md={2}>
                <div className={classes.moveRight}> 
                    {
                        index === 0 &&
                        <CustomIconButton icon="copy" title={Lang.copyToAll} onClick={copyToAll} />
                    }
                    <CustomIconButton icon="reset" title={Lang.addNewShift} title="Reset" onClick={() => reset(index, null, null)} />
                </div>
            </GridItem>
            <input type="hidden" name={`shiftRecords[${index}].shiftDay`} value={index} ref={register} />
        </GridContainer>

    )
})

const AddShift = memo(({ shiftData }) => {
    console.log("AddShift");
    const classes = useStyles();
    // const [error, setError] = useState();
    const { register, control, handleSubmit, reset, watch, errors, setValue, getValues, setError } = useForm({
        defaultValues: {
            shiftName: shiftData && shiftData.shiftName
        }
    });
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
        {
            control,
            name: "shiftRecords"
        }
    );
    const resetForm = () => {
        setValue("shiftName", "");
        days.forEach((element, index) => {
            resetStrip(index, null, null);
        })
    }
    const onSubmit = useCallback(
        (data) => {

            console.log("data", data)
            setError("shiftRecords[0]", {
                type: "customError",
                message: "custom error"
            })
            return false;
        },
        [],
    );
    const copyToAll = useCallback(
        () => {
            let shiftValue = getValues()
            const startTime = shiftValue.shiftRecords[0].shiftStartTime;
            const endTime = shiftValue.shiftRecords[0].shiftEndTime;
            days.forEach((element, index) => {
                resetStrip(
                    index,
                    startTime,
                    endTime
                );
            })
        },
        [],
    )
    const resetStrip = useCallback(
        (index, start, end) => {
            console.log("resetStrip", index)
            setValue(`shiftRecords[${index}].shiftStartTime`, start);
            setValue(`shiftRecords[${index}].shiftEndTime`, end);
        },
        [],
    )
    const deleteShift = useCallback(
        (shiftId) => {
            console.log(`delete shift ${shiftId}`)
        },
        [],
    )

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <div className={classes.moveRight}>
                <CustomIconButton icon="save" type="submit" title={Lang.addNewShift} />
                <CustomIconButton icon="reset" title={Lang.resetForm} onClick={resetForm} />
                {
                    shiftData && shiftData.shiftId &&
                    <CustomIconButton icon="delete" title={Lang.deleteShift} onClick={() => deleteShift(shiftData.shiftId)} />
                }
            </div>
            <GridContainer style={{ padding: "5px 0" }}>
                <GridItem xs={12} sm={12} md={12}>
                    <div className={classes.flexJustify}>
                        <CustomInput
                            labelText="Shift Name"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "text",
                                inputRef: register({ minLength: 3, maxLength: 100, required: true }),
                                name: "shiftName"
                            }}
                            helperText={errors.shiftName && Lang.shiftNameError}
                        />
                        <span className={classes.required}>*</span>
                    </div>
                </GridItem>
            </GridContainer>
            {
                days.map((ele, index) => {
                    return (
                        <ShiftStrip
                            index={index}
                            control={control}
                            shiftData={shiftData}
                            copyToAll={copyToAll}
                            reset={resetStrip}
                            err={errors}
                            register={register}
                        />
                    );
                })
            }
        </form >
    )
})

export default AddShift;