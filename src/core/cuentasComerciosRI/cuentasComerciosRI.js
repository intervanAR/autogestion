export const flattenCuenta = (cuenta) => ({
    ...cuenta,
    descripcion: cuenta.nroComercio + ' - ' + cuenta.razon_social + ' (' + cuenta.cuit + ')',
});

export const flattenCuentas = (cuentas) => (cuentas || []).map(flattenCuenta);
