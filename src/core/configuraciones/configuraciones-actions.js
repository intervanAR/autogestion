import { createActions } from "redux-actions";

export const {getValorConfiguracion} = createActions({
    'GET_VALOR_CONFIGURACION': (params) => ({ API: { endpoint: { url: `/comercios/valorConfiguraciones`, method: 'get', params }, needsToken: true, } }),
});
