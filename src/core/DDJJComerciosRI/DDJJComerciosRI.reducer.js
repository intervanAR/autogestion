import {handleActions} from 'redux-actions';
import * as actionTypes from './DDJJComerciosRI-actions';
import {handleApiAction} from '../services/ApiMiddleware.reducer';
import {remove} from "lodash";

const initialState = {
    data: [
        // {
        //     id: 1,
        //     numero: '328607',
        //     año: '2018',
        //     periodo: '10',
        //     act: '',
        //     tipo: '1',
        //     rec: 'No',
        //     valor: '10000',
        //     importe: '132,50',
        //     saldo: '132,50',
        //     estado: 'Confirmado'
        // },
        // {
        //     id: 2,
        //     numero: '328276',
        //     año: '2018',
        //     periodo: '8',
        //     act: '',
        //     tipo: '1',
        //     rec: 'No',
        //     valor: '10000',
        //     importe: '132,50',
        //     saldo: '132,50',
        //     estado: 'Confirmado'
        // },
    ],
    actividades: [],
    tiposDeclaraciones: [],
    declaraPorActividad: false,
    loadingDDJJComerciosRI: false,
    DDJJComerciosRIError: false,
};

export default handleActions({
    ...handleApiAction(actionTypes.getDDJJComerciosRI, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {payload: {data = []}}) => {
            return {
                ...state,
                data
            };
        }),
    ...handleApiAction(actionTypes.getActividadesComercio, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {payload: {data: actividades = []}}) => {
            return {
                ...state,
                actividades
            };
        }),
    ...handleApiAction(actionTypes.getDeclaraPorActividad, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {payload: {data = []}}) => {
            return {
                ...state,
                declaraPorActividad: data && data[0] && data[0].valor === 'S'
            };
        }),
    ...handleApiAction(actionTypes.getTiposDeclaraciones, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {payload: {data : tiposDeclaraciones = []}}) => {
            return {
                ...state,
                tiposDeclaraciones
            };
        }),
    ...handleApiAction(actionTypes.getActividadPorComercioFromApi, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {}) => {
            return {
                ...state
            };
        }),
    ...handleApiAction(actionTypes.getFechaCalculoAnteriorFromApi, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {}) => {
            return {
                ...state
            };
        }),
    ...handleApiAction(actionTypes.getAlicuotaFromApi, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {}) => {
            return {
                ...state
            };
        }),
    ...handleApiAction(actionTypes.getMinimoFromApi, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {}) => {
            return {
                ...state
            };
        }),
    ...handleApiAction(actionTypes.getDDJJDefinitivaAnteriorFromApi, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {}) => {
            return {
                ...state
            };
        }),
    ...handleApiAction(actionTypes.getDDJJAnticipoAnteriorFromApi, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {}) => {
            return {
                ...state
            };
        }),
    ...handleApiAction(actionTypes.getDDJJImporteFromApi, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {}) => {
            return {
                ...state
            };
        }),
    ...handleApiAction(actionTypes.getDDJJCarga, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {}) => {
            return {
                ...state
            };
        }),
    ...handleApiAction(actionTypes.getDDJJPendientePago, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {}) => {
            return {
                ...state
            };
        }),
    ...handleApiAction(actionTypes.getDDJJActualImporteFromApi, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {}) => {
            return {
                ...state
            };
        }),
    ...handleApiAction(actionTypes.getDDJJImporteFijoFromApi, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {}) => {
            return {
                ...state
            };
        }),
    ...handleApiAction(actionTypes.getCodImpuestoFromApi, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {}) => {
            return {
                ...state
            };
        }),
    ...handleApiAction(actionTypes.confirmarDDJJFromApi, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {payload:{params: {nroDeclaracion}}}) => {
            const {data: dataDDJJComerciosRI} = state;
            return {
                ...state,
                data: dataDDJJComerciosRI.map(d => {
                    if (d.nroDeclaracion.toString() === nroDeclaracion.toString()) return ({...d, estado: 'CON'});
                    return d;
                }),
            };
        }),
    ...handleApiAction(actionTypes.anularDDJJFromApi, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {payload:{params: {nroDeclaracion}}}) => {
            const {data: dataDDJJComerciosRI} = state;
            return {
                ...state,
                data: dataDDJJComerciosRI.map(d => {
                    if (d.nroDeclaracion.toString() === nroDeclaracion.toString()) return ({...d, estado: 'ANU'});
                    return d;
                }),
            };
        }),
    ...handleApiAction(actionTypes.crearDDJJ, {loadingField: 'loadingDDJJComerciosRI', errorField: 'DDJJComerciosRIError'},
        (state, {payload:{data, requestPayload}}) => {
            const {data: dataDDJJComerciosRI} = state;
            dataDDJJComerciosRI.unshift({...requestPayload, ...data, estado: 'CON'});
            return {
                ...state,
                data: dataDDJJComerciosRI,
            };
        }),
}, initialState);
