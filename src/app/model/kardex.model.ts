export interface modelKardex{
    pro_id: number,
    pro_nombre: string,
    pro_descripcion: string,
    pro_iva: boolean,
    pro_costo: number,
    pro_pvp: number,
    pro_imagen: string,
    pro_stock: number,
    pro_categoria: String,
    aju_det_cantidad:number
    movimientos: []
}