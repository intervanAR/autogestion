import {handleActions} from 'redux-actions';
import * as actionTypes from './pagos-actions';
import {handleApiAction} from '../services/ApiMiddleware.reducer';
import {remove} from "lodash";
import { flattenMediosPago } from './mediosPago.js';
const initialState = {
    data: [
    ],
    mediosPago: [],
    gatewaysPago: [],
    resumenPrevio : [],
    loadingPagos: false,
    PagosError: false,
};
/*
...handleApiAction(actionTypes.postResumenPago, {loadingField: 'loadingPagos', errorField: 'PagosError'},
(state, {payload: {data = []}}) => {
    return {
        ...state,
        data
    };
}),*/
export default handleActions({
    ...handleApiAction(actionTypes.getResumenDeudaPago, {loadingField: 'loadingPagos', errorField: 'PagosError'},
        (state, {payload: {data = []}}) => {
            return {
                ...state,
                data
            };
        }),
    ...handleApiAction(actionTypes.setResumenPrevio, {loadingField: 'loadingPagos', errorField: 'PagosError'},
        (state, {payload: {resumenPrevio = []}}) => {
            return {
                ...state,
                resumenPrevio
            };
        }),
    ...handleApiAction(actionTypes.getMediosPago, {loadingField: 'loadingPagos', errorField: 'PagosError'},
        (state, {payload: {data = []}}) => {
            return {
                ...state,
                mediosPago:flattenMediosPago(data)
            };
        }),
    ...handleApiAction(actionTypes.getGatewayPago, {loadingField: 'loadingPagos', errorField: 'PagosError'},
        (state, {payload: {gatewaysPago  = []}}) => {
            return {
                ...state,
                gatewaysPago
            };
        }),
    ...handleApiAction(actionTypes.postPagar, {loadingField: 'loadingPagos', errorField: 'PagosError'},
        (state, {payload: {data = []}}) => {
            return {
                ...state,
                data
            };
        }),
}, initialState);
