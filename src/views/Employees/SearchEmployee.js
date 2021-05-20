import React, { useEffect, useState } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import api from '../../variables/api.json';
import axios from 'axios';
import { bugs, website, server, config } from "variables/general.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
// import Card from "components/Card/Card.js";
// import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
// import CardBody from "components/Card/CardBody.js";
// import CardFooter from "components/Card/CardFooter.js";
import InputLabel from "@material-ui/core/InputLabel";
import Lang from '../../variables/lang.json';
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import { setUserSession, setAppCache, appCache, shiftData, getData } from '../../utils/Common.js';
import styles from "assets/jss/material-dashboard-react/views/employeesStyle.js";
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';
import { RssFeed } from "@material-ui/icons";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import { getEmployees, getEmployeeList } from '../../utils/api.js'
import AddEmployeeForm from './AddEmployeeForm.js'
import SearchIcon from '@material-ui/icons/Search';
import { useForm, Controller } from "react-hook-form";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const SearchEmployee = React.memo(function SearchEmployeeFun({ updateList, close }) {

    const { register, handleSubmit, watch, errors, control, reset } = useForm();
    const onSubmit = (data) => {
        getEmployeeList(data.userName).then(res => {
            updateList(res.data);
        })
    }
    const closeFun = () => {
        getEmployeeList().then(res => {
            updateList(res.data);
            close();
        })
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Tooltip title={Lang.close} style={{ float: "right" }}>
                    <IconButton aria-label="add" onClick={() => closeFun()}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                            labelText="User Name"
                            id="userId"
                            formControlProps={{
                                fullWidth: false
                            }}
                            inputProps={{
                                inputRef: register({ required: "Name Required", minLength: 3, maxLength: 100 }),
                                name: "userName"
                            }}
                            helperText={errors.userName && Lang.nameLengthError}
                        />
                        <Button color="primary" type="submit">Search</Button>
                        <GridItem xs={12} sm={12} md={5}>

                        </GridItem>
                    </GridItem>
                </GridContainer>
            </form>
        </div>
    )
})

export default SearchEmployee;