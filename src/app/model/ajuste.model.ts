import { ModelDetalle } from "./ajuste-detalle.model";

export interface ModelAjuste {
    aju_numero: string,
    aju_fecha: Date,
    aju_descripcion: string,
    aju_estado: boolean,
    pro_activo: boolean,
    aju_detalle: ModelDetalle[]
}