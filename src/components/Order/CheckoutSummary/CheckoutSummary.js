import React from 'react';

import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';

import classes from './CheckoutSummary.module.css';

const checkoutSummary = (props) => {
    return (
        <div className={classes.CheckoutSummary}>
            <h1>Enjoy you burger!</h1>
            <div style={{width: '100%', margin: 'auto'}}>
                <Burger ingredients={props.ingredients}/>
            </div>
            <Button btnType="Danger" buttonClick={props.checkoutCancel}>CANCEL</Button>
            <Button btnType="Success" buttonClick={props.checkoutContinue}>CONTINUE</Button>
        </div>
    );

}

export default checkoutSummary;