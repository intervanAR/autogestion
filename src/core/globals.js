import {createBrowserHistory} from 'history';

export const API_URL = __GLOBALS__.API_URL;
export const BASE_URL = __GLOBALS__.BASE_URL;
export const MODO_ANONIMO = __GLOBALS__.MODO_ANONIMO;

// @WARN: Only use this one if you don't have a way to make the call from a component that has a router context
export const browserHistory = createBrowserHistory();

export const getFullUrl = (url='') => {
    return `${BASE_URL}${url}`;
};
