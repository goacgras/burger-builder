import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorhandler';
import * as actions from '../../store/actions/index';

import axios from '../../axios-order';


const BurgerBuilder = props => {
    // constructor(props) {
    //     super(props);  
    //     this.state = {...}
    // }
    const [orderStatus, setOrderStatus] = useState(false);
    const { onInitIngredients } = props;

    useEffect(() => {
        // console.log('burgerbuilder useEffect')
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = ingredients => {
        //Calculate ingredients value for orderStatus
        //ingredients[igKey] is the value / numbers on the object value (0,0,0,0)
        const sum = Object.keys(ingredients)
            .map(igKey => { return ingredients[igKey] })
            .reduce((sum, el) => { return sum + el }, 0);

        return sum > 0;
    }

    const orderStatushandler = () => {
        if (props.isAuthenticated) {
            setOrderStatus(true);
        } else {
            //holding path to checkout
            props.onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }

    }

    const purchaseCancelOrder = () => {
        setOrderStatus(false);
    }

    const purchaseContinueOrder = () => {

        // const queryParams = [];
        // for(let i in this.state.ingredients){
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // //passing total price
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: '?' + queryString
        // });

        props.onInitPurchase();
        props.history.push('/checkout');
    }


    const disableInfo = { ...props.ings };

    for (let key in disableInfo) {
        disableInfo[key] = disableInfo[key] <= 0; //disableInfo[key] = value of each elements
    }

    let orderSummary = null;

    let burger = props.error ? <p>Ingredients can't be Loaded...!</p> : <Spinner />
    if (props.ings) {
        burger = (
            <Aux>
                <Burger ingredients={props.ings} />
                <BuildControls
                    ingredientAdded={props.onAddIngredient}
                    ingredientRemoved={props.onRemoveIngredient}
                    disabled={disableInfo}
                    purchaseable={updatePurchaseState(props.ings)}
                    orderStatus={orderStatushandler}
                    price={props.price}
                    isAuth={props.isAuthenticated} />
            </Aux>
        );
        orderSummary = <OrderSummary
            ingredients={props.ings}
            cancelOrder={purchaseCancelOrder}
            continueOrder={purchaseContinueOrder}
            totalPrice={props.price} />
    }

    return (
        <Aux>
            <Modal show={orderStatus} bckdrpClick={purchaseCancelOrder}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );

}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
}
const mapDispatchToProps = dispatch => {
    return {
        //directy add the actions from buildControl
        onAddIngredient: (ingName) => dispatch(actions.addIngredient(ingName)),
        onRemoveIngredient: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));