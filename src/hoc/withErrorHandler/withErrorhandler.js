import React, { useState, useEffect } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary';

//GLOBAL ERROR HANDLE LOCALLY
// this component will wrapped burgerBuilder and get the error message from firebase and show error at modal 
//click backdrop to clear the error locally

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, setError] = useState(null);

        //for post request
        const reqInterceptors = axios.interceptors.request.use(req => {
            setError(null);
            return req;
        });
        const resInterceptors = axios.interceptors.response.use(res => res, err => {
            setError(err);
        });

        useEffect(() => {
            return () => {
                axios.interceptors.request.eject(reqInterceptors);
                axios.interceptors.response.eject(resInterceptors);
            };
        }, [reqInterceptors, resInterceptors]);

        const errorConfirmedHandler = () => {
            setError(null);
        }

        return (
            <Aux>
                <Modal
                    show={error}
                    bckdrpClick={errorConfirmedHandler}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        );

    }
}


export default withErrorHandler;