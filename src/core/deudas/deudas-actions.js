import { createActions } from "redux-actions";
import {file} from "./refactura";

export const {getDeudas, refacturar, getFacturaPDF, getResumenDeuda, postPagoResumen} = createActions({
    'GET_DEUDAS': (params) => ({
      API: {
        endpoint: {
          url: `/deudas`,
          method: 'get',
          params
        },
        needsToken: false,
      }
    }),
    //'GET_FACTURA_P_D_F': (params) => ({ data: file }),
    'REFACTURAR': (params) => ({
      API: {
        endpoint: {
          url: `/deudas/refacturar`,
          method: 'get',
          params
        },
        needsToken: false,
      }
    }),
    'GET_FACTURA_P_D_F': (params) => ({
      API: {
        endpoint: {
          url: `/deudas/factura`,
          method: 'get',
          //responseType: 'application/pdf' ,
          params
        },
        needsToken: false,
      }
    }),
    'GET_RESUMEN_DEUDA': (params) => ({
      API: {
        endpoint: {
          url: `/deudas/resumenDeuda2`,
          method: 'get',
          params
        },
        needsToken: false,
      }
    }),
    'POST_PAGO_RESUMEN': (params) => ({
      API: {
        endpoint: {
          url: `/pago/resumenPago`,
          method: 'post',
          params
        },
        needsToken: false,
      }
    }),
    //'REFACTURAR': (params) => ({ data: file }),
});
