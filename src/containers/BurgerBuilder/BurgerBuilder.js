import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'

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
        purchaseable: false
    }

    updatePurchaseState(ingredients) {
     
        //ingredients[igKey] is the value / numbers on the object value (0,0,0,0)
        const sum = Object.keys(ingredients)
                    .map(igKey => { return ingredients[igKey] })
                    .reduce((sum, el) => { return sum + el }, 0);
        
        this.setState({purchaseable: sum > 0});
    }

    addIngredientHandler = (type) => {  
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {...this.state.ingredients};//copy of state ingredients
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients });

        this.updatePurchaseState(updatedIngredients);

    };

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if(oldCount <= 0){  
            return
        }

        const updatedCount = oldCount -1 ;
        const updatedIngredients = {...this.state.ingredients};//copy of state ingredients
        updatedIngredients[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        console.log(newPrice);
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients });

        this.updatePurchaseState(updatedIngredients);
    }

    render () {
        const disableInfo = {...this.state.ingredients};

        for(let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0; //disableInfo[key] = value of eact elements
        }

        return (
            <Aux>
                <Modal>
                    <OrderSummary ingredients={this.state.ingredients} />
                </Modal>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls 
                    ingredientAdded = {this.addIngredientHandler}
                    ingredientRemoved = {this.removeIngredientHandler}
                    disabled = {disableInfo}
                    purchaseable = {this.state.purchaseable}
                    price = {this.state.totalPrice} />
            </Aux>
        );
    }
}   

export default BurgerBuilder;