import Backdrop from '@material-ui/core/Backdrop';
import React, { useState, useEffect, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles();
const Loader = memo(({showLoader}) => {
    const classes = useStyles();
    const [openLoader, setLoader] = useState(showLoader);

    useEffect(() => {
        setLoader(showLoader);
    }, [showLoader])
    return (
        <Backdrop className={classes.backdrop} open={openLoader} style={{ zIndex: "11111" }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
})

export default Loader;