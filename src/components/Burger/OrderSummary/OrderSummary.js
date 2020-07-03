import React from 'react';

import Aux from '../../../hoc/Auxiliary';
import Button from '../../../UI/Button/Button';

const orderSummary = (props) => {
    const ingredientsSummary = Object.keys(props.ingredients)
        .map(igKey => {
            return (
                <li key={igKey}>
                    <span style={{ textTransform: 'capitalize' }}>{igKey}: {props.ingredients[igKey]}</span>
                </li>
            );
        });

    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with following ingredients: </p>
            <ul>
                {ingredientsSummary}
            </ul>
            <p>Continue to checkout?</p>
            <Button btnType="Danger" buttonClick={props.cancelOrder}>CANCEL</Button>
            <Button btnType="Success" buttonClick={props.continueOrder}>CONTINUE</Button>
        </Aux>
    );
}

export default orderSummary;