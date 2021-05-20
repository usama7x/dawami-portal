import React, { useEffect, useState, useCallback, memo } from 'react';
import Snackbar from "components/Snackbar/Snackbar.js";
const Notification = memo(({message, close}) => {
    const [open, setOpen] = useState(false);
    const [place, setPlace] = useState("tr");
    const [color, setColor] = useState("info");
    const [snakMessage, setSnakMessage] = useState(message);

    const showNotification = (message) => {
        setSnakMessage(message);
        setOpen(true);
        setTimeout(() => {
          setOpen(false)
          close()
        }, 3000)
      }
    useEffect(() => {
        showNotification(message)      
    }, []);

    return (
        <Snackbar
        place={place}
        color={color}
        // icon={AddAlert}
        message={message}
        open={open}
        closeNotification={() => setOpen(false)}
        close
      />
    )
})

export default Notification;