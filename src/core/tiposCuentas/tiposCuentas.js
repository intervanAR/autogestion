
export const flattenTiposCuentas = (tiposCuentas) => tiposCuentas.map(tipoCuenta => ({
  id: tipoCuenta.cdCode,
  descripcion: tipoCuenta.dsCode
}));
