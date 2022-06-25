import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductoService } from 'src/app/service/producto.service';
import { ModelProducto } from 'src/app/model/producto.model';


@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  productos: ModelProducto [] = [];
  
  public form! : FormGroup;
 
  public informacionProducto={
    pro_id: -1,
    pro_nombre: "",
    pro_descripcion: "",
    pro_iva: true,
    pro_costo: 0,
    pro_pvp: 0,
    pro_imagen: "",
    pro_stock: 0
  }

  constructor(private productoService:ProductoService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.cargarProductos()
  }

  public cargarProductos(){
    this.productoService.getProductos().subscribe(
      (producto:any)=>{
        this.productos=producto
        console.log(this.productos)
      },(error)=>console.log(error)
    )
  }

}
