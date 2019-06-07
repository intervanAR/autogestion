import {createActions} from "redux-actions";

export const {getDDJJComerciosRI, getActividadesComercio, getDeclaraPorActividad, getTiposDeclaraciones, getActividadPorComercioFromApi, getFechaCalculoAnteriorFromApi, getAlicuotaFromApi, getMinimoFromApi, getDDJJDefinitivaAnteriorFromApi, getDDJJAnticipoAnteriorFromApi, getDDJJImporteFromApi, getDDJJCarga, getDDJJPendientePago, getDDJJActualImporteFromApi, getDDJJImporteFijoFromApi, getCodImpuestoFromApi, crearDDJJ, confirmarDDJJFromApi, anularDDJJFromApi, getDeclaracionPDF} = createActions({
    'GET_D_D_J_J_COMERCIOS_R_I': (params) => ({
        API: {
            endpoint: {url: `/comercios/ddjj`, method: 'get', params},
            needsToken: true,
        }
    }),
    'GET_ACTIVIDADES_COMERCIO': (params) => ({
        API: {
            endpoint: {url: `/comercios/actividades`, method: 'get', params},
            needsToken: true,
        }
    }),
    'GET_DECLARA_POR_ACTIVIDAD': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/DDJJxActividad`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'GET_TIPOS_DECLARACIONES': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/tiposDeclaraciones`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'GET_ACTIVIDAD_POR_COMERCIO_FROM_API': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/retornarDdjjActividad`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'GET_FECHA_CALCULO_ANTERIOR_FROM_API': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/retornarFechaCalculoAnt`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'GET_ALICUOTA_FROM_API': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/retornarDdjjAlicuota`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'GET_MINIMO_FROM_API': (params) => ({
        API: {
            endpoint: {url: `/comercios/retornarDdjjMinimo`, method: 'get', params},
            needsToken: true,
        }
    }),
    'GET_D_D_J_J_DEFINITIVA_ANTERIOR_FROM_API': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/retornarDdjjDefAnterior`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'GET_D_D_J_J_ANTICIPO_ANTERIOR_FROM_API': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/retornarDdjjAntAnterior`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'GET_D_D_J_J_IMPORTE_FROM_API': (params) => ({
        API: {
            endpoint: {url: `/comercios/retornarDdjjImporte`, method: 'get', params},
            needsToken: true,
        }
    }),
    'GET_D_D_J_J_CARGA': (params) => ({
        API: {
            endpoint: {url: `/comercios/retornarDdjjCarga`, method: 'get', params},
            needsToken: true,
        }
    }),
    'GET_D_D_J_J_PENDIENTE_PAGO': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/retornarDdjjPendPago`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'GET_D_D_J_J_ACTUAL_IMPORTE_FROM_API': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/calcularDdjjImporte`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'GET_D_D_J_J_IMPORTE_FIJO_FROM_API': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/retornarDdjjFijo`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'GET_COD_IMPUESTO_FROM_API': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/retornarImpuestoTipoDDJJ`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'CREAR_D_D_J_J': (data) => ({
        API: {
            endpoint: {
                url: `/comercios/insertarDdjj`,
                method: 'post',
                data
            }, needsToken: true,
        }
    }),
    'CONFIRMAR_D_D_J_J_FROM_API': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/confirmarDdjj`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'ANULAR_D_D_J_J_FROM_API': (params) => ({
        API: {
            endpoint: {
                url: `/comercios/anularDdjj`,
                method: 'get',
                params
            }, needsToken: true,
        }
    }),
    'GET_DECLARACION_P_D_F': (params) => ({
      API: {
        endpoint: {
          url: `/comercios/declaracion`,
          method: 'get',
          responseType: 'application/pdf' ,
          params
        },
        needsToken: false,
      }
    }),
});


export const getDDJJImporteFijo = (item) => (dispatch) => {
    const {idComercio, idActividad: codActividad, fechaCalculoAnterior: fechaCalculo} = item;
    return dispatch(getDDJJImporteFijoFromApi({idComercio, codActividad, fechaCalculo}))
        .then(respuesta => respuesta && respuesta[0] && respuesta[0].valor);
};

export const getDDJJActualImporte = (item) => (dispatch) => {
    const {idComercio, idActividad: codActividad, valor, alicuota, minimo, fechaCalculoAnterior: fechaCalculo} = item;
    return dispatch(getDDJJActualImporteFromApi({idComercio, codActividad, valor, alicuota, minimo, fechaCalculo}))
        .then(respuesta => respuesta && respuesta[0] && respuesta[0].valor);
};

export const getAlicuota = (item) => (dispatch) => {
    const {idComercio, idActividad: codActividad, fechaCalculoAnterior: fechaCalculo} = item;
    if (idComercio && fechaCalculo)
        return dispatch(getAlicuotaFromApi({idComercio, codActividad, fechaCalculo}))
            .then(respuesta => respuesta && respuesta[0] && respuesta[0].valor);
    return Promise.resolve(0);
};

export const getCodImpuestoFechaCalculoAnteriorAlicuotaMinimo = (item) => (dispatch) => {
    const {idComercio, tipoDeclaracion} = item;
    if (idComercio && tipoDeclaracion)
        return dispatch(getCodImpuestoFromApi({idComercio, tipoDeclaracion}))
            .then(respuesta => {
                const codImpuesto = respuesta && respuesta[0] && respuesta[0].valor;
                return getFechaCalculoAnteriorAlicuotaMinimo({...item, codImpuesto})(dispatch)
                    .then(fechaCalculoAnteriorAlicuotaMinimo => ({...fechaCalculoAnteriorAlicuotaMinimo, codImpuesto}));
            });
    return null;
};

export const getMinimo = (item) => (dispatch) => {
    const {idComercio, idActividad: codActividad, fechaCalculoAnterior: fechaCalculo} = item;
    if (idComercio && fechaCalculo)
        return dispatch(getMinimoFromApi({idComercio, codActividad, fechaCalculo}))
            .then(respuesta => respuesta && respuesta[0] && respuesta[0].valor);
    return Promise.resolve(0);
};

export const getImporteAnterior = (nroDeclaracion) => (dispatch) => {
    if (nroDeclaracion)
        return dispatch(getDDJJImporteFromApi({nroDeclaracion}))
            .then(respuesta => respuesta && respuesta[0] && Number(respuesta[0].valor));
    return Promise.resolve(0);
};

export const getActividadPorComercio = (item) => (dispatch) => {
    const {idComercio} = item;
    return dispatch(getActividadPorComercioFromApi({idComercio}))
        .then((respuesta) => respuesta && respuesta[0] && respuesta[0].valor);
};

export const getFechaCalculoAnteriorAlicuotaMinimo = (item) => (dispatch) => {
    const {codImpuesto, anio, cuota} = item;
    if (codImpuesto && anio && cuota)
        return dispatch(getFechaCalculoAnteriorFromApi({codImpuesto, anio, cuota}))
            .then(respuesta => {
                const fechaCalculoAnterior = respuesta && respuesta[0] && respuesta[0].valor;
                return Promise.all([
                    dispatch(getAlicuota({...item, fechaCalculoAnterior})),
                    dispatch(getMinimo({...item, fechaCalculoAnterior})),
                ])
                    .then(([alicuota, minimo]) => {
                        return ({
                            fechaCalculoAnterior,
                            alicuota,
                            minimo
                        })
                    });
            });
    return Promise.resolve({});
};

export const getDeclaracionesAnterioresObj = (item) => (dispatch) => {
    const {idComercio, idActividad: codActividad, tipoDeclaracion, anio, cuota} = item;
    if (idComercio && codActividad && tipoDeclaracion && anio && cuota)
        return Promise.all([
            dispatch(getDDJJDefinitivaAnteriorFromApi({idComercio, codActividad, tipoDeclaracion, anio, cuota})),
            dispatch(getDDJJAnticipoAnteriorFromApi({idComercio, codActividad, tipoDeclaracion, anio, cuota})),
        ])
            .then(respuestas => {
                const nroDeclaracionDefAnterior = respuestas[0] && respuestas[0][0] && respuestas[0][0].valor;
                const nroDeclaracionAntAnterior = respuestas[1] && respuestas[1][0] && respuestas[1][0].valor;
                const response = {
                    rectificacion: 'N',
                    nroDeclaracionRec: null,
                    anticipo: 'N',
                    nroDeclaracionAnt: null,
                    importeAnterior: "0",
                };
                if (nroDeclaracionDefAnterior) {
                    response.rectificacion = 'S';
                    response.nroDeclaracionRec = nroDeclaracionDefAnterior;
                    return getImporteAnterior(nroDeclaracionDefAnterior)
                        .then(importeAnterior => ({
                            importeAnterior,
                            ...response,
                        }));
                }
                if (nroDeclaracionAntAnterior) {
                    response.anticipo = 'S';
                    response.nroDeclaracionAnt = nroDeclaracionAntAnterior;
                    return getImporteAnterior(nroDeclaracionAntAnterior)
                        .then(importeAnterior => ({
                            importeAnterior,
                            ...response,
                        }));
                }
                return response;
            });
    return {};
};

export const confirmarDDJJ = (item) => (dispatch) => {
    const {nroDeclaracion} = item;
    return dispatch(confirmarDDJJFromApi({nroDeclaracion}))
        .then(respuesta => respuesta && respuesta[0] && respuesta[0].valor);
};

export const anularDDJJ = (item) => (dispatch) => {
    const {nroDeclaracion} = item;
    return dispatch(anularDDJJFromApi({nroDeclaracion}))
        .then(respuesta => respuesta && respuesta[0] && respuesta[0].valor);
};
