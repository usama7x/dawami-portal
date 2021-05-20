import React, { useState, memo, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Chip from '@material-ui/core/Chip';

import Typography from '@material-ui/core/Typography';

import Lang from '../../variables/lang.json';
import styles from "assets/jss/material-dashboard-react/views/profileStyle.js";
import CustomIconButton from '../Common/CustomIconButton';
import {
    TimePicker
} from '@material-ui/pickers';

const useStyles = makeStyles(styles);
const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

const ShiftStrip = memo(({ index, startTime, endTime, getShift, shiftRecordId, copyToAllMain }) => {
    console.log("ShiftStrip", index)
    // console.log(startTime,endTime)
    const classes = useStyles();
    const [start, setStart] = useState({
        value: startTime,
        error: null
    });
    const [end, setEnd] = useState({
        value: endTime,
        error: null
    });
    const reset = () => {
        setStart({
            value: null,
            error: null
        })
        setEnd({
            value: null,
            error: null
        })
        getShift(index, {
            shiftDay: index,
            shiftStartTime: null,
            shiftEndTime: null,
            shiftRecordId: shiftRecordId
        })
    }
    const copyToAll = () => {
        copyToAllMain({
            shiftStartTime: start.value,
            shiftEndTime: end.value
        })
    }

    const handleStart = (e) => {

        if (end.value) {
            if (Date.parse(e) < Date.parse(end.value)) {
                setStart({
                    value: e,
                    error: null
                })
                if (shiftRecordId) {
                    getShift(index, {
                        shiftDay: index,
                        shiftStartTime: e,
                        shiftEndTime: end.value,
                        shiftRecordId: shiftRecordId
                    })
                } else {
                    getShift(index, {
                        shiftDay: index,
                        shiftStartTime: e,
                        shiftEndTime: end.value
                    })
                }
            } else {
                setStart({
                    value: null,
                    error: Lang.invalid
                })
            }

        } else {
            setStart({
                value: e,
                error: null
            })
            setEnd({
                value: null,
                error: Lang.required
            })
        }
    }
    const handleEnd = (e) => {
        if (start.value) {
            if (Date.parse(e) > Date.parse(start.value)) {
                setEnd({
                    value: e,
                    error: null
                })
                if (shiftRecordId) {
                    getShift(index, {
                        shiftDay: index,
                        shiftStartTime: start.value,
                        shiftEndTime: e,
                        shiftRecordId: shiftRecordId
                    })
                } else {
                    getShift(index, {
                        shiftDay: index,
                        shiftStartTime: start.value,
                        shiftEndTime: e
                    })
                }
            } else {
                setEnd({
                    value: null,
                    error: Lang.invalid
                })
            }

        } else {
            setEnd({
                value: e,
                error: null
            })
            setStart({
                value: null,
                error: Lang.required
            })
        }
    }

    useEffect(() => {
        // console.log(index)
        // getShift(index, {
        //     shiftDay: index,
        //     shiftStartTime: startTime,
        //     shiftEndTime: endTime,
        //     shiftRecordId: shiftRecordId
        // })
        setStart({
            value: startTime,
            error: null
        })

        setEnd({
            value: endTime,
            error: null
        })
    }, [startTime, endTime, index])
    return (
        <GridContainer style={{ padding: "5px 0" }}
            key={`days${index}`}
        >
            <GridItem xs={12} sm={12} md={4} style={{ alignItems: "flex-end", display: "flex" }}>
                <Chip label={days[index]} className={classes.customLabel} />
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
                <TimePicker
                    fullWidth
                    label={Lang.shiftStartTime}
                    value={start.value}
                    onChange={handleStart}
                    ampm={false} />
                <Typography variant="caption" >
                    {start.error}
                </Typography>
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
                <TimePicker
                    fullWidth
                    label={Lang.shiftEndTime}
                    value={end.value}
                    onChange={handleEnd}
                    ampm={false} />
                <Typography variant="caption">
                    {end.error}
                </Typography>
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
        </GridContainer>
    )
});

export default ShiftStrip;