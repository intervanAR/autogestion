import {handleActions} from 'redux-actions';
import * as actionTypes from './cuentas-actions';
import {handleApiAction} from '../services/ApiMiddleware.reducer';
import {flattenCuentas} from "./cuentas";
import {remove} from "lodash";

const initialState = {
    data: [],
    loadingCuentas: false,
    cuentasError: false,
};

export default handleActions({
    ...handleApiAction(actionTypes.getCuentas, {loadingField: 'loadingCuentas', errorField: 'cuentasError'},
        (state, {payload: {data = []}}) => {
            return {
                ...state,
                data: flattenCuentas(data)
            };
        }),
}, initialState);
