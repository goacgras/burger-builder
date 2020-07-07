import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorhandler';

import axios from '../../axios-order';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }

    state = {
        ingredients: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 4,
        purchaseable: false,
        orderStatus: false,
        loading: false
    }

    updatePurchaseState(ingredients) {
        //Calculate ingredients value for orderStatus
        //ingredients[igKey] is the value / numbers on the object value (0,0,0,0)
        const sum = Object.keys(ingredients)
            .map(igKey => { return ingredients[igKey] })
            .reduce((sum, el) => { return sum + el }, 0);

        this.setState({ purchaseable: sum > 0 });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = { ...this.state.ingredients };//copy of state ingredients
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });

        this.updatePurchaseState(updatedIngredients);

    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if (oldCount <= 0) {
            return
        }

        const updatedCount = oldCount - 1;
        const updatedIngredients = { ...this.state.ingredients };//copy of state ingredients
        updatedIngredients[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });

        this.updatePurchaseState(updatedIngredients);
    }

    orderStatushandler = () => {
        this.setState({ orderStatus: true });
    }

    purchaseCancelOrder = () => {
        this.setState({ orderStatus: false });
    }

    purchaseContinueOrder = () => {
        this.setState({loading: true});
         
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice.toFixed(2),
            customer: {
                name: 'Fachreza Ghifary',
                address: {
                    street: 'test street no 1',
                    zipCode: '123322',
                    country: 'Indonesia'
                },
                email: 'testemail@test.com'
            },
            deliveryMethod: 'gojek'
        }
        axios.post('/orders.json', order)
            .then(res => {
                this.setState({loading: false, orderStatus: false});
            })
            .catch(err => {
                this.setState({loading: false, orderStatus: false});
            });

        // alert('You will be recieving your order soon!');
    }

    render() {
        const disableInfo = { ...this.state.ingredients };

        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0; //disableInfo[key] = value of eact elements
        }

        let orderSummary = <OrderSummary
            ingredients={this.state.ingredients}
            cancelOrder={this.purchaseCancelOrder}
            continueOrder={this.purchaseContinueOrder}
            totalPrice={this.state.totalPrice} />
        if(this.state.loading) {
            orderSummary = <Spinner/>
        }

        return (
            <Aux>
                <Modal show={this.state.orderStatus} bckdrpClick={this.purchaseCancelOrder}>
                    {orderSummary}
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disableInfo}
                    purchaseable={this.state.purchaseable}
                    orderStatus={this.orderStatushandler}
                    price={this.state.totalPrice} />
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);