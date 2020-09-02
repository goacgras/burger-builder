import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
    const dispatch = useDispatch();
    
    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });
    const price = useSelector(state => {
        return state.burgerBuilder.totalPrice;
    });
    const error = useSelector(state => {
        return state.burgerBuilder.error;
    });
    const isAuthenticated = useSelector(state => {
        return state.auth.token !== null;
    });

    //directy add the actions from buildControl
    const onAddIngredient = (ingName) => dispatch(actions.addIngredient(ingName));
    const onRemoveIngredient = (ingName) => dispatch(actions.removeIngredient(ingName));
    //useCallback for not create infinite loop
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

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
        if (isAuthenticated) {
            setOrderStatus(true);
        } else {
            //holding path to checkout
            onSetAuthRedirectPath('/checkout');
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

        onInitPurchase();
        props.history.push('/checkout');
    }


    const disableInfo = { 
        ...ings 
    };

    for (let key in disableInfo) {
        disableInfo[key] = disableInfo[key] <= 0; //disableInfo[key] = value of each elements
    }

    let orderSummary = null;

    let burger = error ? <p>Ingredients can't be Loaded...!</p> : <Spinner />
    if (ings) {
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onAddIngredient}
                    ingredientRemoved={onRemoveIngredient}
                    disabled={disableInfo}
                    purchaseable={updatePurchaseState(ings)}
                    orderStatus={orderStatushandler}
                    price={price}
                    isAuth={isAuthenticated} />
            </Aux>
        );
        orderSummary = <OrderSummary
            ingredients={ings}
            cancelOrder={purchaseCancelOrder}
            continueOrder={purchaseContinueOrder}
            totalPrice={price} />
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


export default withErrorHandler(BurgerBuilder, axios);