import { find } from "lodash";

export const getTipoDeclaracion = (tiposDeclaraciones, tipoDeclaracion) => find(tiposDeclaraciones, (td) => td.tipoDeclaracion === tipoDeclaracion);
