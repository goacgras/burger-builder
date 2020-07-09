import React, { Component } from 'react';
import axios from '../../axios-order';

import Order from '../../components/Order/Order';
import WithErrorHandler from '../../hoc/withErrorHandler/withErrorhandler';

class Orders extends Component {

    state = {
        orders: [],
        loading: true
    }

    componentDidMount() {
        axios.get('/orders.json')
            .then(res => {
                const fetchOrders = [];
                for(let key in res.data) {
                    fetchOrders.push({
                        ...res.data[key],
                        id: key
                    });
                }
                this.setState({ loading: false, orders: fetchOrders });
            })
            .catch(res => {
                this.setState({ loading: false });
            });

    }

    render() {
        return (
            <div>
                <Order />
                <Order />
            </div>
        );
    }
}

export default WithErrorHandler(Orders, axios);