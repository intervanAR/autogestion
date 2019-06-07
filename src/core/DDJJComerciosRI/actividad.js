import { find } from "lodash";

export const getActividad = (actividades, idActividad) => find(actividades, (a) => a.cod_actividad === idActividad);
