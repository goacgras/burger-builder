import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

class Checkout extends Component {
    state = {
        ingredients: {
            salad: 1,
            bacon: 1,
            cheese: 1,
            meat: 1
        }
    }

    componentDidMount(){
        console.log(this.props);
        const query = new URLSearchParams(this.props.location.search);
        const ingredientsFrmQuery = {};
        for(let param of query.entries()){
            //["salad", "1"]...
            ingredientsFrmQuery[param[0]] = +param[1];
        }
        console.log(ingredientsFrmQuery);
        this.setState({ingredients: ingredientsFrmQuery});
    }

    checkoutCancelHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinueHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }
    render () {
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    checkoutCancel={this.checkoutCancelHandler}
                    checkoutContinue={this.checkoutContinueHandler}/>
                <Route path={this.props.match.path + '/contact-data'} component={ContactData}/>                
            </div>
        );
    }
}

export default Checkout;