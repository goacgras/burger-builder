import React, { Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import axios from '../../../axios-order.js';
import Spinner from '../../../components/UI/Spinner/Spinner'
import classes from './ContactData.module.css';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });

        console.log(this.props.price)
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
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
                this.setState({ loading: false });

                //passing props while render at checkout for history to work
                console.log(this.props);
                this.props.history.push('/');
            })
            .catch(err => {
                this.setState({ loading: false });
            });

        // alert('You will be recieving your order soon!');
    }

    render() {
        let form = (
            <form>
                <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
                <input className={classes.Input} type="email" name="email" placeholder="Your Email" />
                <input className={classes.Input} type="text" name="street" placeholder="Street" />
                <input className={classes.Input} type="text" name="postal" placeholder="Postal Code" />
                <Button btnType="Success" buttonClick={this.orderHandler}>ORDER</Button>
            </form>
        );

        if (this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData;