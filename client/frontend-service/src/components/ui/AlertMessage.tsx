import React from 'react';
import { Message } from 'rsuite';


const AlertMessage: any = ( type:'success' | 'error' | 'info' | 'warning' , msg: string ) => (
    <Message showIcon type={type} closable>
        {msg}
    </Message>
);

export default AlertMessage;
