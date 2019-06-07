import {handleActions} from 'redux-actions';
import * as actionTypes from './pagos-actions';
import {handleApiAction} from '../services/ApiMiddleware.reducer';
import {remove} from "lodash";

const initialState = {
    data: [
    ],
    resumenPrevio : [],
    loadingPagos: false,
    PagosError: false,
};

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
    ...handleApiAction(actionTypes.postResumenPago, {loadingField: 'loadingPagos', errorField: 'PagosError'},
        (state, {payload: {data = []}}) => {
            return {
                ...state,
                data
            };
        }),
}, initialState);
