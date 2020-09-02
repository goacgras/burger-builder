import React from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary';
import useHttpErrorHandler from '../../hooks/http-error-handler';

//GLOBAL ERROR HANDLE LOCALLY
// this component will wrapped burgerBuilder and get the error message from firebase and show error at modal 
//click backdrop to clear the error locally

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, clearError] = useHttpErrorHandler(axios);
        return (
            <Aux>
                <Modal
                    show={error}
                    bckdrpClick={clearError}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </Aux>
        );

    }
}


export default withErrorHandler;