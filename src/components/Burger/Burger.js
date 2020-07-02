import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => { 
    //.keys return the key of an object salad.. etc
    // 'i' is the length of the value inside array
    // igKey is the value inside array
    // type of igKey has to be the same with the name of ingredients
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_, i) =>{
               return <BurgerIngredient key={igKey + i} type={igKey} />
            }); 
        }).reduce((arr, el) => { return arr.concat(el) }, [] );

    if(transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default burger;