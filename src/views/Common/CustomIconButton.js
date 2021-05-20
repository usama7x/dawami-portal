import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
// import { IconButton } from "@material-ui/core"
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import PrintIcon from '@material-ui/icons/Print';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import AddIcon from '@material-ui/icons/Add';
let styles = {
    type1: {
        color: "#43adc1",
        // boxShadow: "0px 0px 6px 0px rgb(0 0 0 / 10%)"
    },
    hover: {
        "MuiIconButton-root:hover": {
            color: "gold"
        }
    }
}
const useStyles = makeStyles(styles);
const CustomIconButton = memo(({
    title,
    onClick,
    type,
    className,
    color,
    size,
    icon
}) => {
    const classes = useStyles();

    return (
        <Tooltip title={title} className={className}>
            <IconButton
                aria-label={title}
                onClick={onClick}
                className={`${color === "invert" ? classes.type1 : ''} ${classes.hover}`}
                // size={size}
                type={type}>
                {
                    icon === "delete" && <DeleteIcon /> ||
                    icon === "edit" && <EditIcon /> ||
                    icon === "save" && <SaveIcon /> ||
                    icon === "clear" && <ClearIcon style={{ color: "red" }} /> ||
                    icon === "print" && <PrintIcon /> ||
                    icon === "reset" && <RotateLeftIcon /> ||
                    icon === "copy" && <FileCopyIcon /> ||
                    icon === "add" && <AddIcon />
                }
            </IconButton>
        </Tooltip>
    )
})

export default CustomIconButton;