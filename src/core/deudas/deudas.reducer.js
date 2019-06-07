import {handleActions} from 'redux-actions';
import * as actionTypes from './deudas-actions';
import {handleApiAction} from '../services/ApiMiddleware.reducer';
import {remove} from "lodash";

const initialState = {
    data: [
        // {
        //     id: 1,
        //     concepto: 'Tasa de Limpieza y Conservación de la Vía Pública',
        //     periodo: '2/2018',
        //     fechaVencimiento: '12/02/2018',
        //     capital: '692.88',
        //     intereses: '77.40',
        //     gastos: '0.00',
        //     total: '770.28'
        // }
    ],
    loadingResumenDeudas: false,
    resumenDeudasError: false,
};

export default handleActions({
    ...handleApiAction(actionTypes.getResumenDeuda, {loadingField: 'loadingResumenDeudas', errorField: 'resumenDeudasError'},
        (state, {payload: {data = []}}) => {
            return {
                ...state,
                data
            };
        }),
}, initialState);
