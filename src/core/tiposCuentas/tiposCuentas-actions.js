import { createActions } from "redux-actions";

export const {getTiposCuentas, getCuentas} = createActions({
    'GET_TIPOS_CUENTAS': () => ({
      API: {
        endpoint: {
          url: `/deudas/tiposImponibles`,
          method: 'get'
        },
        needsToken: false,
      }
    }),
});
