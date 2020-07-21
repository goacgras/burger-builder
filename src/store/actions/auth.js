import axios from 'axios';

import * as actionTypes from './actionTypes';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    };
};

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const auth = (username, password) => {
    const authData = {
        email: username,
        password: password,
        returnSecureToken: true
    }
    return dispatch => {
        dispatch(authStart());
        axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDLh_N_XH3R9ESa3_HS8b_ilKNlaabfGco', authData)
        .then(res => {
            console.log(res);
            dispatch(authSuccess(res.data));
        })
        .catch(err => {
            console.log(err);
            dispatch(authFail(err));
        });
    }
};