import { combineReducers } from 'redux';
import auth from './auth/auth-reducer';
import tiposCuentas from './tiposCuentas/tiposCuentas.reducer';
import cuentas from './cuentas/cuentas.reducer';
import resumenDeudas from './deudas/deudas.reducer';
import cuentasComerciosRI from './cuentasComerciosRI/cuentasComerciosRI.reducer';
import DDJJComerciosRI from './DDJJComerciosRI/DDJJComerciosRI.reducer';
import configuraciones from './configuraciones/configuraciones.reducer';
import pagos from './pagos/pagos-reducer';

export const getRootReducer = () => {
    return combineReducers({
        auth,
        tiposCuentas,
        cuentas,
        resumenDeudas,
        cuentasComerciosRI,
        DDJJComerciosRI,
        configuraciones,
        pagos,
    });
};
