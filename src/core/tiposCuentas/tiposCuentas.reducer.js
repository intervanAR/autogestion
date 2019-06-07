import {handleActions} from 'redux-actions';
import * as actionTypes from './tiposCuentas-actions';
import {handleApiAction} from '../services/ApiMiddleware.reducer';
import {flattenTiposCuentas} from "./tiposCuentas";
import {remove} from "lodash";

const initialState = {
    data: [],
    loadingTiposCuentas: false,
    tiposCuentasError: false,
};

export default handleActions({
    ...handleApiAction(actionTypes.getTiposCuentas, {loadingField: 'loadingTiposCuentas', errorField: 'tiposCuentasError'},
        (state, {payload: {data = []}}) => {
            return {
                ...state,
                data: flattenTiposCuentas(data)
            };
        }),
}, initialState);
