import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-order.js';
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input';

import classes from './ContactData.module.css';

class ContactData extends Component {
    state = {
        orderForm : {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false

            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIPCODE'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email address'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    option: [
                        { value: 'gojek', displayValue: 'Gojek' },
                        { value: 'grab', displayValue: 'Grab' },
                    ]
                },
                value: ''
            },
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });

        const formData = {};
        for(let formElementIdentifier in this.state.orderForm){
            //copy the value inside orderForm to formData
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        console.log(this.props.price)
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData
        }
        axios.post('/orders.json', order)
            .then(res => {
                this.setState({ loading: false });

                //passing props while render at checkout for history to work
                console.log(order);
                this.props.history.push('/');
            })
            .catch(err => {
                this.setState({ loading: false });
            });

        // alert('You will be recieving your order soon!');
    }

    checkValidity(value, rules) {
        let isValid = true;

        //if required
        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }
        if(rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
        if(rules.maxLength) {
            isValid = value.length <= rules.minLength && isValid
        }
        
        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        //copy(name, street, zipcode ...)
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        //copy inside ( elementType, elementConfig, value)
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        //change the value
        updatedFormElement.value = event.target.value;
        //if validation is required checkValidity
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        //check if input has been touch
        updatedFormElement.touched = true;
        //change the value
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        
        // console.log(updatedFormElement.value);

        //store to state
        this.setState({orderForm: updatedOrderForm});
        
        console.log(updatedOrderForm[inputIdentifier]);
    } 

    render() {
        const formElementsArray = [];

        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                //value (elementType, config, value)
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)} />
                ))}
                <Button btnType="Success" >ORDER</Button>
            </form>
        );

        if (this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter Your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;