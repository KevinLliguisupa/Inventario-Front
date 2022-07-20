import { Pipe, PipeTransform } from '@angular/core';
import { ModelProducto } from '../model/producto.model';

@Pipe({
  name: 'filtroproducto'
})
export class FiltroproductoPipe implements PipeTransform {

  transform(value: ModelProducto[], nombre:string="",propName:string): unknown {
    const lista : any = [];
    if(!value || nombre=='' || propName==''){
      return value
    }
    const filtroNombrePro = value.forEach((pro: any)=>{
      if(pro.pro_nombre.trim().toLowerCase().includes(nombre.toLowerCase())){
        lista.push(pro)
      }
    })

    return lista
    
  }

}
