import { createActions } from "redux-actions";

export const { getResumenDeudaPago, setResumenPrevio, postResumenPago, postPagar, getGatewayPago, getMediosPago } = createActions({
    'GET_RESUMEN_DEUDA_PAGO': (params) => ({
      API: {
        endpoint: {
          url: `/deudas/resumenDeudaPago`,
          method: 'get',
          params
        },
        needsToken: false,
      }
    }),
    'SET_RESUMEN_PREVIO': (params) => ({resumenPrevio: params }),
    'POST_RESUMEN_PAGO': (data) => ({
      API: {
        endpoint: {
          url: `/pagos/resumenPago`,
          method: 'post',
          data
        },
        needsToken: true,
      }
    }),
    'POST_PAGAR': (data) => ({
      API: {
        endpoint: {
          url: `/pagos/pagar`,
          method: 'post',
          data
        },
        needsToken: true,
      }
    }),
    'GET_GATEWAY_PAGO': (params) => ({
      API: {
        endpoint: {
          url: `/pagos/obtener_gateway_pago`,
          method: 'get',
          params
        },
        needsToken: false,
      }
    }),
    'GET_MEDIOS_PAGO': (params) => ({
      API: {
        endpoint: {
          url: `/pagos/obtener_medios_pago`,
          method: 'get',
          params
        },
        needsToken: false,
      }
    }),
});
