import { createAction } from "redux-actions";
import Api from "../services/API";
import * as localStorageService from '../services/localStorageService';
import {getFullUrl} from "../globals";

export const AUTH_LOGIN = createAction('AUTH_LOGIN');
export const AUTH_LOGIN_OK = createAction('AUTH_LOGIN_OK');
export const AUTH_LOGIN_FAIL = createAction('AUTH_LOGIN_FAIL');
export const AUTH_LOGOUT = createAction('AUTH_LOGOUT');
export const AUTH_USER_INFO = createAction('AUTH_USER_INFO');

let browserHistory;
export function setDeps (_browserHistory) {
    browserHistory = _browserHistory;
}

export function login (username, password) {
    return (dispatch) => {
        dispatch(AUTH_LOGIN());
        if (!username || !password) {
            return dispatch(AUTH_LOGIN_FAIL({ message: 'Username and Password are required' }));

        }
        return Api.login(username, password)
            .then(resp => storeTokenAndGetUserInfo(resp[0], dispatch))
            .then(()=> redirectIfNeededAfterLogin())
            .catch(e => {
                console.log(e);
                dispatch(AUTH_LOGIN_FAIL({ message: 'Username or Password is incorrect' }));
                throw new Error('Username or Password is incorrect');
            });
    };
}

export function loginFromLocalStorage () {
    return (dispatch) => {
        let token = localStorageService.getItem('token');
        if(!token) {
            return Promise.resolve({});
        }
        return storeTokenAndGetUserInfo(token, dispatch)
            .catch(e => {
                console.log(e);
                dispatch(AUTH_LOGIN_FAIL({ message: '' }));
            });
    };
}

export const requireAuthentication = () => () => {
    const currPath = browserHistory.location.pathname;
    localStorageService.setItem('redirectToAfterLogin', currPath);
    browserHistory.replace(getFullUrl(''));
};

export function isLoggedIn() {
    return !!getCurrentToken();
}

export function getCurrentToken () {
    return localStorageService.getItem('token');
}

function storeTokenAndGetUserInfo (token, dispatch) {
    localStorageService.setItem('token', token);
    dispatch(AUTH_LOGIN_OK({ token }));

    return Api.getMe()
        .then(resp => {
            dispatch(AUTH_USER_INFO(resp));
        });
}

const redirectIfNeededAfterLogin = function () {
    const redirectTo = localStorageService.getItem('redirectToAfterLogin');
    if (redirectTo) {
        localStorageService.removeItem('redirectToAfterLogin');
        return browserHistory.replace(redirectTo);
    }
    browserHistory.replace(getFullUrl(''));
};

export function logout () {
    localStorageService.removeItem('token');
    localStorageService.removeItem('redirectToAfterLogin');
    browserHistory.replace(getFullUrl(''));
    return AUTH_LOGOUT();
}
