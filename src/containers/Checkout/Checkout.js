import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

const Checkout = props => {
    //getting query params
    // UNSAFE_componentWillMount() {
    //     console.log(this.props);
    //     const query = new URLSearchParams(this.props.location.search);
    //     const ingredientsFrmQuery = {};
    //     let price = 0;

    //     for (let param of query.entries()) {
    //         //["salad", "1"]...
    //         //if params is price dont put it into ingredients
    //         if (param[0] === 'price') {
    //             price = +param[1];
    //         } else {
    //             ingredientsFrmQuery[param[0]] = +param[1];
    //         }

    //     }
    //     console.log(ingredientsFrmQuery);
    //     this.setState({ ingredients: ingredientsFrmQuery, totalPrice: price });
    // }

    const checkoutCancelHandler = () => {
        props.history.goBack();
    }

    const checkoutContinueHandler = () => {
        props.history.replace('/checkout/contact-data');
    }

    let summary = <Redirect to="/" />
    if (props.ings) {
        const purchaseRedirect = props.purchased ? <Redirect to="/" /> : null;
        summary = (
            <div>
                {purchaseRedirect}
                <CheckoutSummary
                    ingredients={props.ings}
                    checkoutCancel={checkoutCancelHandler}
                    checkoutContinue={checkoutContinueHandler} />
                <Route
                    path={props.match.path + '/contact-data'}
                    component={ContactData} />
            </div>
        );
    }
    return summary;

}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    };
}

export default connect(mapStateToProps)(Checkout);