import React, { useState, forwardRef, useImperativeHandle } from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const ShowMessage = forwardRef((props, ref) => {
    const [message, setMessage] = useState({open: false, type: "", text: ""});
    
    useImperativeHandle(ref, () => ({
        showError(m) {
            setMessage({open: true, type: "error", text: m})
        },

        showSuccess(m) {
            setMessage({open: true, type: "success", text: m})
        }  
    }));

    const closeMessage = (event, reason) => {
        setMessage({open: false, type: message.type, text: message.text});
    }  

    return (
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={message.open} autoHideDuration={6000} onClose={closeMessage}>
            <MuiAlert elevation={6} variant="filled" onClose={closeMessage} severity={message.type}>
                {message.text}
            </MuiAlert>
        </Snackbar>
    )
});

export default ShowMessage;