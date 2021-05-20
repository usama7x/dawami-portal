import React, { memo, useEffect, useCallback, useState, useRef } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { getOrgUserAttendanceApi, getAttendanceReportApi, getAttendanceApi, getUserAttendanceExcelApi } from '../../utils/api.js'
import Loader from "../Common/Loader";
import DownloadReport from "./DownloadReport";
import SearchForm from './SearchForm';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Tooltip from '@material-ui/core/Tooltip';
import PrintReport from "../Common/Print";
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    table: {
        minWidth: 700,
    },
}));

const AttendanceReport = memo(() => {
    const classes = useStyles();
    const [setLoaderFlag, setLoader] = useState(true);
    const [empData, setEmpData] = useState([]);
    const [empId, setEmpId] = useState(null);
    let AttendanceListRef = useRef(null);
    let SingleUserAttendanceRef = useRef(null);
    // start and end date for list and report
    const currentDate = new Date();
    let defaultTime = {
        startTime: (new Date(currentDate.setDate(1))),
        endTime: (new Date())
    }
    let timeIso = {
        startTime: defaultTime.startTime.toISOString(),
        endTime: defaultTime.endTime.toISOString()
    }
    const [defaultDate, setDate] = useState(timeIso);
    const [attendanceList, setAttendanceList] = useState(null);

    const updateList = useCallback(
        async (data) => {

            let plist = data.map(async data => {
                return [
                    data.userId,
                    data.userName,
                    data.workingHrs,
                    data.absentDays,
                    data.earlyOutMinutes,
                    data.lateInMinites
                ]
            });
            let list = await Promise.all(plist);
            setEmpData(list);
            setTimeout(() => {
                setLoader(false)
            }, 500);
        },
        []
    )

    const onSearch = (data) => {
        setLoader(true)
        timeIso.startTime = data.checkInDate;
        timeIso.endTime = data.checkOutDate;
        setDate({
            startTime: timeIso.startTime,
            endTime: timeIso.endTime
        });
        if(empId) {
            getAttendanceApi({
                userId: empId.empId,
                startDate: timeIso.startTime,
                endDate: timeIso.endTime
            }).then(res => {
                setAttendanceList(res.data)
                setLoader(false)
            }).catch(err => {
                setLoader(false)
            })
        }else {
            getOrgUserAttendanceApi(timeIso.startTime, timeIso.endTime).then(res => {
                updateList(res.data);
                setLoader(false)
            })
        }
    }

    useEffect(() => {
        getOrgUserAttendanceApi(timeIso.startTime, timeIso.endTime).then(res => {
            updateList(res.data)
        })
    }, []);

    const handleEmpClick = (empId, empName) => {
        // debugger;
        // console.log(ev.currentTarget.children[0].innerText);
        // const empId = parseInt(ev.currentTarget.children[0].innerText);
        // const empName = ev.currentTarget.children[1].innerText
        setEmpId({
            empId,
            empName
        })
        getAttendanceApi({
            userId: empId,
            startDate: timeIso.startTime,
            endDate: timeIso.endTime
        }).then(res => {
            setAttendanceList(res.data)
        })
    }

    const AttendanceList = memo(() => {
        return (
            <TableContainer component={Paper} ref={AttendanceListRef}>
                <Table className={classes.table} aria-label="customized table" >
                    <TableHead>
                        <TableRow>
                            <StyledTableCell style={{display: "none"}}>User Id</StyledTableCell>
                            <StyledTableCell>Full Name</StyledTableCell>
                            <StyledTableCell align="right">Working&nbsp;hour</StyledTableCell>
                            <StyledTableCell align="right">Absent&nbsp;days</StyledTableCell>
                            <StyledTableCell align="right">Early&nbsp;out&nbsp;minutes</StyledTableCell>
                            <StyledTableCell align="right">Late&nbsp;in&nbsp;minutes</StyledTableCell>
                            <StyledTableCell align="right">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {empData.map((row) => (
                            <StyledTableRow key={row[1]}  >
                                <StyledTableCell align="right" style={{display: "none"}}>{row[0]}</StyledTableCell>
                                <StyledTableCell >
                                    {row[1]}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row[2]}</StyledTableCell>
                                <StyledTableCell align="right">{row[3]}</StyledTableCell>
                                <StyledTableCell align="right">{row[4]}</StyledTableCell>
                                <StyledTableCell align="right">{row[5]}</StyledTableCell>
                                <StyledTableCell align="right" onClick={() => handleEmpClick(row[0],row[1])} style={{ cursor: "pointer", color: "rgb(67, 173, 193)" }}>Show&nbsp;Details</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    })

    const SingleUserAttendance = memo(({ attendanceList }) => {
        return (
            <TableContainer component={Paper} ref={SingleUserAttendanceRef}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="right" style={{display: "none"}}>attendanceId</StyledTableCell>
                            <StyledTableCell align="right">Checkin Date</StyledTableCell>
                            <StyledTableCell align="right">Checkout Date</StyledTableCell>
                            <StyledTableCell align="right">Lately check-in Minutes</StyledTableCell>
                            <StyledTableCell align="right">Early Checkout Minutes</StyledTableCell>
                            <StyledTableCell align="right">workingHrs</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attendanceList.map((row) => (
                            <StyledTableRow key={row[1]}>
                                <StyledTableCell component="th" scope="row" style={{display: "none"}}>
                                    {row.attendanceId}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row.checkInDate}</StyledTableCell>
                                <StyledTableCell align="right">{row.checkOutDate}</StyledTableCell>
                                <StyledTableCell align="right">{row.lateCheckinMinutes}</StyledTableCell>
                                <StyledTableCell align="right">{row.earlyCheckoutMinutes}</StyledTableCell>
                                <StyledTableCell align="right">{row.workingHrs}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    })

    return (
        <div>
            <GridContainer>
                {
                    empId &&
                    <GridItem xs={12} sm={12} md={12}>
                        <Tooltip title="Back" onClick={() => setEmpId(null)}>
                            <IconButton aria-label="back">
                                <ArrowBackIcon />
                            </IconButton>
                        </Tooltip>
                    </GridItem>
                }
                {
                    empId &&
                    <GridItem xs={12} sm={12} md={12}>
                        <h2 style={{ margin: "0" }}>{empId.empName}</h2>
                    </GridItem>
                }
                <GridItem xs={12} sm={12} md={6}>
                    <SearchForm onSubmit={onSearch} dateOnly={true} validation={true} startDate={defaultTime.startTime} endDate={defaultTime.endTime} />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                    <div style={{ float: "right" }}>
                        {
                            (
                                (!empId && empData && empData.length != 0) ||
                                ( empId  && attendanceList && attendanceList.length != 0) 
                            ) && <DownloadReport startDate={defaultDate.startTime} userId={empId?empId.empId:null} endDate={defaultDate.endTime} reportApi={empId?getUserAttendanceExcelApi:getAttendanceReportApi} /> 
                        }
                        {
                            (
                                (!empId && empData && empData.length != 0) ||
                                (empId && attendanceList && attendanceList.length != 0)
                            ) &&
                            <PrintReport 
                            hiddenCol={!empId?6:-1} 
                            elementRef={!empId?AttendanceListRef.current:SingleUserAttendanceRef.current}
                            name={!empId ? "" : empId.empName}  />
                        }
                    </div>
                </GridItem>
            </GridContainer>
            <Loader showLoader={setLoaderFlag} />
            {
                empId && attendanceList && 
                <SingleUserAttendance attendanceList={attendanceList} close={() => setEmpId(null)} />    
            }
            {!empId && <AttendanceList />}
        </div>
    )
});

export default AttendanceReport;