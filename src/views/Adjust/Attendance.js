import React, { useEffect, useState, useCallback, memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { getAttendanceApi, deleteAttendanceApi, addAttendanceApi, editAttendanceApi } from "../../utils/api.js";
import AddAttendance from './AddAttendance';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Notification from "../Common/Notification";
import Loader from "../Common/Loader";
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function createData(attendanceId, checkInDate, checkOutDate, earlyCheckoutMinutes, lateCheckinMinutes) {
    return { attendanceId, checkInDate, checkOutDate, earlyCheckoutMinutes, lateCheckinMinutes };
}




function Attendance({ empId, close, showNotification, showLoader }) {
    console.log("attendanceqq")
    const classes = useStyles();
    let getAttendanceData = null;
    const [rows, setRows] = useState([]);
    const [openAttendanceForm, setOpenAttendanceForm] = useState(false);
    const [checkInOutDate, setcheckInOutDate] = useState(null);

    const deleteAttendance = useCallback(
        (id) => {
            deleteAttendanceApi(id).then(res => {
                refreshAttendanceList();
            })
        },
        [],
    )

    const refreshAttendanceList = useCallback(
        () => {
            onAttendanceRange();
        },
        [empId],
    )

    const attendanceList = useCallback(
        (data) => {
            let attendance = data.map(attendance => {
                return createData(
                    attendance.attendanceId,
                    attendance.checkInDate,
                    attendance.checkOutDate,
                    attendance.earlyCheckoutMinutes,
                    attendance.lateCheckinMinutes
                )
            })
            setRows(attendance);
            showLoader(false);
        },
        [],
    )

    const onAttendanceSubmit = useCallback(
        (data) => {
            // console.log(openAttendanceForm);
            // debugger
            if (openAttendanceForm === true) {
                data.userId = empId.id;
                addAttendanceApi(data).then(res => {
                    showNotification();
                    refreshAttendanceList();
                })
            } else {
                data.userId = empId.id;
                editAttendanceApi(openAttendanceForm, data).then(res => {
                    showNotification();
                    refreshAttendanceList();
                })
            }
            setOpenAttendanceForm(false)
            console.log(data)
        },
        [openAttendanceForm],
    )
    const onAttendanceRange = useCallback(
        (data) => {
            // debugger;
            showLoader(true);
            if (data) {
                data.userId = empId.id;
                data.startDate = data.checkInDate;
                data.endDate = data.checkOutDate;
                delete data.checkInDate;
                delete data.checkOutDate;
                getAttendanceData = { ...data };
            } else if (getAttendanceData) {
                data = { ...getAttendanceData }
            } else {
                data = {
                    userId: empId.id
                }
            }
            getAttendanceApi(data).then(res => {
                attendanceList(res.data);
                setcheckInOutDate([]);
            })
        },
        [],
    )
    useEffect(() => {
        showLoader(true);
        // debugger;
        getAttendanceApi({
            userId: empId.id
        }).then(res => {
            attendanceList(res.data)
        })
    }, [empId])
    const handleEdit = (attendanceId, vcheckInDate, vcheckOutDate) => {
        setcheckInOutDate([
            vcheckInDate ? new Date(vcheckInDate): null,
            vcheckOutDate ? new Date(vcheckOutDate): null
        ]);
        
        setOpenAttendanceForm(attendanceId);
    }
    return (
        <TableContainer component={Paper}>
            <Tooltip title="Back" onClick={close}>
                <IconButton aria-label="delete">
                    <ArrowBackIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Add Attendance">
                <Fab color="primary" aria-label="add" onClick={() => {setcheckInOutDate([]);setOpenAttendanceForm(true)}} style={{ float: "right" }}>
                    <AddIcon />
                </Fab>
            </Tooltip>
            <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                    <h3>{empId.empName}</h3>
                </GridItem>
                <GridItem xs={12} sm={12} md={8}>
                    <AddAttendance formName=" " onSubmit={onAttendanceRange} validation={false} />
                </GridItem>
            </GridContainer>
            {
                openAttendanceForm && 
                <AddAttendance 
                    formType="popup" 
                    close={() => { setOpenAttendanceForm(false) }} 
                    onSubmit={onAttendanceSubmit} 
                    validation={true} 
                    formName={ (checkInOutDate && checkInOutDate.length != 0) || (checkInOutDate && checkInOutDate.length != 0) ? "Edit Attendance": ''}
                    checkInDate={checkInOutDate && checkInOutDate.length != 0 ?checkInOutDate[0]:null}
                    checkOutDate={checkInOutDate && checkInOutDate.length != 0 ? checkInOutDate[1]:null}
                    />}
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{display:"none"}}>attendanceId</TableCell>
                        <TableCell align="right">Checkin Date</TableCell>
                        <TableCell align="right">Checkout Date</TableCell>
                        <TableCell align="right">Lately Checkin Minutes</TableCell>
                        <TableCell align="right">Early Checkout Minutes</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.attendanceId} >
                            <TableCell component="th" scope="row" style={{display:"none"}}>
                                {row.attendanceId}
                            </TableCell>
                            <TableCell align="right">{row.checkInDate}</TableCell>
                            <TableCell align="right">{row.checkOutDate}</TableCell>
                            <TableCell align="right">{row.lateCheckinMinutes}</TableCell>
                            <TableCell align="right">{row.earlyCheckoutMinutes}</TableCell>
                            <TableCell align="right">
                                <IconButton aria-label="delete" onClick={() => deleteAttendance(row.attendanceId)}>
                                    <DeleteIcon />
                                </IconButton>
                                <IconButton aria-label="edit" onClick={() => handleEdit(row.attendanceId, row.checkInDate, row.checkOutDate)}>
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
const AttendanceList = React.memo(Attendance);
const AttendanceContiner = React.memo((props) => {
    const [showNotification, setShowNotification] = useState(null)
    const [loaderFlag, setLoaderFlag] = useState(true);
    const showNotificationCB = useCallback(
        () => {
            setShowNotification("true")
        },
        [],
    )
    const loadingCB = useCallback(
        (flag) => {
            setLoaderFlag(flag)
        },
        [],
    )
    return (
        <div>
            {
                showNotification && <Notification message="Data Saved!!" close={() => setShowNotification(false)} />
            }
            {
                <Loader showLoader={loaderFlag} />
            }
            <AttendanceList {...props} showNotification={showNotificationCB} showLoader={loadingCB} />
        </div>
    )
})

export default AttendanceContiner;