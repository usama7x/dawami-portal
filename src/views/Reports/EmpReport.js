import React, { memo, useEffect, useCallback, useState, useRef } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { getEmployeeList, getEmployeeReportApi } from '../../utils/api.js'
import Loader from "../Common/Loader";
import DownloadReport from "./DownloadReport";
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

const EmpReport = memo(() => {
    const classes = useStyles();
    const [setLoaderFlag, setLoader] = useState(true);
    const [empData, setEmpData] = useState([]);
    let reportRef = useRef(null);
    const updateList = useCallback(
        async (data) => {

            let plist = data.map(async data => {
                return [
                    data.userId,
                   null, // data.profileImage ? await getImage(data.profileImage) : '',
                    `${data.firstName} ${data.lastName}`,
                    data.otpCode,
                    data.mobile,
                    data.email
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

    useEffect(() => {
        getEmployeeList().then(res => {
            updateList(res.data)
        }).catch(err => {
            setLoader(false)
        })
    }, []);

    return (
        <div>
            <Loader showLoader={setLoaderFlag} />
            <div style={{float: "right"}}>
                {
                    empData && empData.length != 0 && <DownloadReport reportApi={getEmployeeReportApi}/>
                }
                {
                 empData && empData.length != 0 && <PrintReport elementRef={reportRef.current} id={"empTable"}/>   
                }
            </div>
            <TableContainer component={Paper} ref={reportRef} id="empTable">
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Full Name</StyledTableCell>
                            <StyledTableCell align="right">Phone number</StyledTableCell>
                            <StyledTableCell align="right">Code</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {empData.map((row) => (
                            <StyledTableRow key={row[2]}>
                                <StyledTableCell component="th" scope="row">
                                    {row[2]}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row[4]}</StyledTableCell>
                                <StyledTableCell align="right">{row[3]}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
});

export default EmpReport;