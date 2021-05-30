import React, { memo } from "react";
// import Table from "components/Table/Table.js";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    minWidth: 700,
  },
}));
const EmployeesList = memo(({ data, onEmpClick }) => {
  const classes = useStyles();
  const handleClick = (id, empName) => {
    onEmpClick({
      id,
      empName,
    });
  };
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell style={{ display: "none" }}>ID</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">One-Time Code</TableCell>
            <TableCell align="right">Mobile Number</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row[0]}>
              <TableCell align="right" style={{ display: "none" }}>
                {row[0]}
              </TableCell>
              <TableCell align="right">{row[2]}</TableCell>
              <TableCell align="right">{row[3]}</TableCell>
              <TableCell align="right">{row[4]}</TableCell>
              <TableCell align="right">{row[5]}</TableCell>
              <TableCell
                align="right"
                style={{ cursor: "pointer", color: "rgb(67, 173, 193)" }}
                onClick={() => handleClick(row[0], row[2])}
              >
                Adjust records
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default EmployeesList;
