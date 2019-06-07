import { handleActions } from 'redux-actions';
import * as actionTypes from './auth-actions';

const initialState = {
    token: 0,
    user: {},
    errorMessage: '',
    loadingUser: false
};

export default handleActions({
    [actionTypes.AUTH_LOGIN]: (state) => {
        return { ...state, loadingUser: true };
    },
    [actionTypes.AUTH_LOGIN_OK]: (state, action) => {
        return { ...state, token: action.payload.token, loadingUser: false };
    },
    [actionTypes.AUTH_LOGIN_FAIL]: (state, action) => {
        return { ...state, token: '', errorMessage: action.payload.message, loadingUser: false };
    },
    [actionTypes.AUTH_USER_INFO]: (state, action) => {
        const user = action.payload;
        return { ...state, user};
    },
    [actionTypes.AUTH_LOGOUT]: (state, action) => {
        return { ...initialState };
    },
}, initialState);
