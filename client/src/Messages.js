import React, { useState, forwardRef, useImperativeHandle } from "react";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';

const ShowMessage = forwardRef((props, ref) => {
    const [message, setMessage] = useState({open: false, type: "", text: "", href: "#"});
    //const preventDefault = (event) => event.preventDefault();

    const show = (type, m, tx) => {
        if(tx) {
            const link = "https://rinkeby.etherscan.io/tx/" + tx;
            setMessage({open: true, type: type, text: m, href: link});
        } else {
            setMessage({open: true, type: type, text: m, href: "#"});
        }          
    };

    useImperativeHandle(ref, () => ({
        showError(m, tx) {show("error", m, tx)},
        showSuccess(m, tx) {show("success", m, tx)}
    }));

    const closeMessage = (event, reason) => {
        setMessage({open: false, type: message.type, text: message.text});
    }  

    return (
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={message.open} autoHideDuration={6000} onClose={closeMessage}>
            <MuiAlert elevation={6} variant="filled" onClose={closeMessage} severity={message.type}>
                <Link href={message.href} target="_blank" rel="noreferrer" color="inherit">
                    {message.text}
                </Link>
            </MuiAlert>
        </Snackbar>
    )
});

export default ShowMessage;