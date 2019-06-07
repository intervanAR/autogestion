import {handleActions} from 'redux-actions';
import * as actionTypes from './cuentasComerciosRI-actions';
import {flattenCuentas} from './cuentasComerciosRI';
import {handleApiAction} from '../services/ApiMiddleware.reducer';
import {remove} from "lodash";

const initialState = {
    data: [
        // {id: '4899', nroComercio: '22222222', descripcion: '22222222 - ESTACION DE SERVICIO PETROBRAS (30223334445)'},
        // {id: '5075', nroComercio: '33333354', descripcion: '33333354 - CEFERINO S.A. (30529046576)'}
    ],
    comercioIdSelected: null,
    loadingCuentasComerciosRI: false,
    cuentasComerciosRIError: false,
};

export default handleActions({
    ...handleApiAction(actionTypes.getCuentasComerciosRI, {loadingField: 'loadingCuentasComerciosRI', errorField: 'cuentasComerciosRIError'},
        (state, {payload: {data = []}}) => {
            return {
                ...state,
                data: flattenCuentas(data)
            };
        }),
    [actionTypes.SELECCIONAR_COMERCIO]: (state, {payload: {idComercio: comercioIdSelected}}) => {
        return { ...state, comercioIdSelected };
    },
}, initialState);
