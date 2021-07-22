import React, { useState, useEffect } from "react";
import { JITBalance } from "./ContractUtils";

const Balance = (props) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if(props.account) {
            JITBalance(props.account)
            .then(res => setValue(res/10**18))
            .catch(err => setValue(0));    
        } else {
            setValue(0);
        }
    });

    return (
        <div>
            <span>{value}</span>
        </div>
    );
}

export default Balance;