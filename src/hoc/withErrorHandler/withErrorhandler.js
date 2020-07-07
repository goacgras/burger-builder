import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary';

//GLOBAL ERROR HANDLE LOCALLY
// this component will wrapped burgerBuilder and get the error message from firebase and show error at modal 
//click backdrop to clear the error locally

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null
        }
        // constructor(props) {
        //     super(props);
        //     axios.interceptors.request.use(req => {
        //         this.setState({ error: null });
        //         return req;
        //     });
        //     axios.interceptors.response.use(res => res, err => {
        //         this.setState({ error: err });
        //     });
        // }

        //for post request
        UNSAFE_componentWillMount() {
            axios.interceptors.request.use(req => {
                this.setState({ error: null });
                return req;
            });
            axios.interceptors.response.use(res => res, err => {
                this.setState({ error: err });
            });
        }

        errorConfirmedHandler = () => {
            this.setState({ error: null });
        }

        render() {
            return (
                <Aux>
                    <Modal
                        show={this.state.error}
                        bckdrpClick={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
}


export default withErrorHandler;