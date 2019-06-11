export const flattenMediosPago = (mediosPago) => mediosPago.map(medioPago => {
  return  {
    actualiza_fecha: medioPago.actualiza_fecha,
    cod_gateway: medioPago.cod_gateway,
    cod_medio_pago: medioPago.cod_medio_pago,
    desc_medio_pago: medioPago.desc_medio_pago,
    icono: medioPago.icono,
    parametros: JSON.parse(medioPago.parametros),
    reporte: medioPago.reporte,
    tipo: medioPago.tipo,
  }
});
