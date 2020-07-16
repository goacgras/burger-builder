import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
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

    checkoutCancelHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinueHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }
    render() {
        let summary = <Redirect to="/" />
        if (this.props.ings) {
            summary = (
                <div>
                    <CheckoutSummary
                        ingredients={this.props.ings}
                        checkoutCancel={this.checkoutCancelHandler}
                        checkoutContinue={this.checkoutContinueHandler} />
                    <Route
                        path={this.props.match.path + '/contact-data'}
                        component={ContactData} />
                </div>
            );
        }
        return summary;
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
    };
}

export default connect(mapStateToProps)(Checkout);