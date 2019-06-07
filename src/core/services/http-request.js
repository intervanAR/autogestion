import axios from "axios";
import { API_URL } from '../../core/globals';
import * as localStorageService from '../services/localStorageService';

const getToken = () => localStorageService.getItem('token');
const settings = { API_URL };
const axiosClient = axios.create({
    baseURL: settings.API_URL,
    // timeout: 1000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json, text/plain, */*',
    }
});

let unauthenticatedAction;

export function initializeAPI (_unauthenticatedAction) {
    unauthenticatedAction = _unauthenticatedAction;
}

export const addAuthorizationHeader = (headers) => {
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export function makeAPICall ({ requestConfig, methodCall, needsToken }) {
    // const parsedDomain = parseDomain(window.location.origin) || { subdomain: 'app' };
    requestConfig = requestConfig || methodCall(); // remove methodCall()

    if (!requestConfig) throw new Error('You must return the axios config from makeAPICall');

    requestConfig.headers = requestConfig.headers || {};
    // requestConfig.headers.domain = parsedDomain && parsedDomain.subdomain;

    const token = getToken();

    addAuthorizationHeader(requestConfig.headers);

    if (needsToken && !token) {
        return Promise.reject('A request to a protected endpoint was made, but we don\'t have a token');
    }

    return axiosClient.request(requestConfig)
        .then(response => response)
        .catch(
            errorResponse => {
                let { response } = errorResponse;
                if (!response || !response.status) {
                    console.log('Hard network error', errorResponse);
                    return Promise.reject({ status: 500, data: { message: 'An error occurred!' } });
                }
                if (response.status === 401) {
                    console.log('Unauthenticated request - login and comeback - status is ', response.status);
                    if (needsToken) {
                        unauthenticatedAction();
                    }
                } else if (response.status === 403) {
                    console.log('Unauthorized request - Not enough privileges ', response.status);
                    // unauthorizeddAction()
                }
                if(!response.data.message) {
                    console.log('Injecting default error');
                    if(typeof response.data === 'string') {
                        response.data = {};
                    }
                    response.data.message = 'An error occurred!!';
                }
                return Promise.reject(response);
            }
        );
}
