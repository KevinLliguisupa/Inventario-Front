import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModelProducto } from 'src/app/model/producto.model';
import { AjusteService } from 'src/app/service/ajuste.service';
import { ProductoService } from 'src/app/service/producto.service';

@Component({
  selector: 'app-create-ajuste',
  templateUrl: './create-ajuste.component.html',
  styleUrls: ['./create-ajuste.component.scss']
})
export class CreateAjusteComponent implements OnInit {

  productos: ModelProducto[] = [];
  productosSelected: ModelProducto[] = [];
  numAjuste!:number
  public form! : FormGroup;


  constructor(private ajusteService: AjusteService, private productoService: ProductoService, private formBuilder:FormBuilder) { }


  ngOnInit(): void {
    this.getNumAjuste()
    this.cargarProductos()
    this.form=this.formBuilder.group({
      formDescrip:[''],
      formFecha:[''],
      formCantidad:['']
    })
  }

  public cargarProductos() {
    this.productoService.getProductos().subscribe(
      (producto: any) => {
        this.productos = producto
      }, (error) => console.warn(error)
    )
  }

  public getNumAjuste(){
    this.ajusteService.getnumero().subscribe(
      (numero:any)=>{
        this.numAjuste=numero.get_nroajuste
      },(error)=>console.log(error)
    )
  }

  public crearAjuste(){

    let detallesd: any[]=[]
    for (let index = 0; index < this.productosSelected.length; index++) {
      const element = this.productosSelected[index];
      detallesd.push({pro_id: element.pro_id, aju_det_cantidad: element.aju_det_cantidad})
    }
    console.log(detallesd)
    this.ajusteService.postCreateAjuste({
      aju_fecha:this.form.value.formFecha,
      aju_descripcion:this.form.value.formDescrip,
      detalles:detallesd
    }).subscribe(respuesta => {
      this.productos= [];
      this.productosSelected= [];
      console.log(respuesta);
      this.form.reset();
      window.location.href = "/ajustes";
    }
    );
  }
  
}
