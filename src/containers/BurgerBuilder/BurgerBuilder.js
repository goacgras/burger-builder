import React, { Component } from 'react';
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


class BurgerBuilder extends Component { 
    // constructor(props) {
    //     super(props);  
    //     this.state = {...}
    // }

    state = {
        orderStatus: false
    }

    componentDidMount() {
        console.log(this.props)
        this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients) {
        //Calculate ingredients value for orderStatus
        //ingredients[igKey] is the value / numbers on the object value (0,0,0,0)
        const sum = Object.keys(ingredients)
            .map(igKey => { return ingredients[igKey] })
            .reduce((sum, el) => { return sum + el }, 0);

        return sum > 0;
    }

    orderStatushandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({ orderStatus: true });
        } else {
            //holding path to checkout
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }

    }

    purchaseCancelOrder = () => {
        this.setState({ orderStatus: false });
    }

    purchaseContinueOrder = () => {

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

        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }

    render() {
        const disableInfo = { ...this.props.ings };

        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0; //disableInfo[key] = value of each elements
        }

        let orderSummary = null;

        let burger = this.props.error ? <p>Ingredients can't be Loaded...!</p> : <Spinner />
        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        ingredientAdded={this.props.onAddIngredient}
                        ingredientRemoved={this.props.onRemoveIngredient}
                        disabled={disableInfo}
                        purchaseable={this.updatePurchaseState(this.props.ings)}
                        orderStatus={this.orderStatushandler}
                        price={this.props.price}
                        isAuth={this.props.isAuthenticated} />
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                cancelOrder={this.purchaseCancelOrder}
                continueOrder={this.purchaseContinueOrder}
                totalPrice={this.props.price} />
        }

        return (
            <Aux>
                <Modal show={this.state.orderStatus} bckdrpClick={this.purchaseCancelOrder}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
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