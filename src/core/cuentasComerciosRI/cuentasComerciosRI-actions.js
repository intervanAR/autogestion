import {createAction, createActions} from "redux-actions";

export const SELECCIONAR_COMERCIO = createAction('SELECCIONAR_COMERCIO');

export const {getCuentasComerciosRI} = createActions({
    'GET_CUENTAS_COMERCIOS_R_I': (params) => ({ API: { endpoint: { url: `/comercios/comercios`, method: 'get', params }, needsToken: true, } }),
});
