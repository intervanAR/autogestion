export const flattenCuentas = (cuentas) => cuentas.map(cuenta => ({
  idCuenta: cuenta.idCuenta,
  tipoCuentaId:cuenta.tipo_cuenta,
  cuentaNro:cuenta.nroCuenta,
  descripcion:cuenta.descripcion,
}));
