import { createActions } from "redux-actions";

export const {getCuentas} = createActions({
    'GET_CUENTAS' : (params) => ({
      API:{
        endpoint: {
          url:`/cuentas`,
          method: 'get',
          params
        }
      }
    }),
});
