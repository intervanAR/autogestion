import { createActions } from "redux-actions";

export const { getResumenDeudaPago, setResumenPrevio, postResumenPago, postPagar } = createActions({
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

});
