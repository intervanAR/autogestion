import {handleActions} from 'redux-actions';
import * as actionTypes from './configuraciones-actions';
import {handleApiAction} from '../services/ApiMiddleware.reducer';
import {remove} from "lodash";

const initialState = {
    PERIODO_INICIO_NUEVA_DDJJ: '',
    loadingConfiguracion: false,
    configuracionError: false,
};

export default handleActions({
    ...handleApiAction(actionTypes.getValorConfiguracion, {loadingField: 'loadingConfiguracion', errorField: 'configuracionError'},
        (state, {payload:{params: {campo}, data: [{valor}]}}) => {
            state[campo] = valor;
            return {
                ...state
            };
        }),
}, initialState);
