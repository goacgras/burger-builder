import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    state = {
        ingredients: null,
        totalPrice: 0
    }

    UNSAFE_componentWillMount() {
        console.log(this.props);
        const query = new URLSearchParams(this.props.location.search);
        const ingredientsFrmQuery = {};
        let price = 0;

        for (let param of query.entries()) {
            //["salad", "1"]...
            //if params is price dont put it into ingredients
            if (param[0] === 'price') {
                price = +param[1];
            } else {
                ingredientsFrmQuery[param[0]] = +param[1];
            }

        }
        console.log(ingredientsFrmQuery);
        this.setState({ ingredients: ingredientsFrmQuery, totalPrice: price });
    }

    checkoutCancelHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinueHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }
    render() {
        return (
            <div>
                <CheckoutSummary
                    ingredients={this.state.ingredients}
                    checkoutCancel={this.checkoutCancelHandler}
                    checkoutContinue={this.checkoutContinueHandler} />
                <Route
                    path={this.props.match.path + '/contact-data'}
                    render={(props) => (<ContactData
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice.toFixed(2)}
                        {...props} />)} />
            </div>
        );
    }
}

export default Checkout;