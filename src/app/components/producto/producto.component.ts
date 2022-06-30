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

  productos: ModelProducto[] = [];

  public form!: FormGroup;

  public informacionProducto = {
    pro_id: -1,
    pro_nombre: "",
    pro_descripcion: "",
    cat_id:0,
    pro_iva: true,
    pro_costo: 0,
    pro_pvp: 0,
    pro_imagen: "",
    pro_stock: 0,
  }



  constructor(private productoService: ProductoService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.cargarProductos()
    this.form = this.formBuilder.group({
      pro_nombre:[''],
      pro_descripcion:[''],
      cat_id:[''],
      pro_iva:[''],
      pro_costo:[''],
      pro_pvp:[''],
      pro_imagen:['']
    })
  }

  public cargarProductos() {
    this.productoService.getProductos().subscribe(
      (producto: any) => {
        this.productos = producto
        console.log(this.productos)
      }, (error) => console.log(error)
    )
  }

  public createProducto() {
    this.productoService.postCreateProducto({
      pro_nombre: this.form.value.pro_nombre,
      pro_descripcion: this.form.value.pro_descripcion,
      cat_id: this.form.value.cat_id,
      pro_iva: this.form.value.pro_iva,
      pro_costo: this.form.value.pro_costo,
      pro_pvp: this.form.value.pro_pvp,
      pro_imagen: this.form.value.pro_imagen
    }
    ).subscribe(respuesta => {
      console.log('Producto enviado');
      //Formulario reseteado
      this.form.reset();
      //Se cargue los datos despues de enviar
      this.cargarProductos();
    }
    );
  }

  public actualizarProducto(pro_id: any) {

    this.productoService.putUpdateProducto(
      {
        pro_id: pro_id,
        pro_nombre: this.form.value.pro_nombre,
        pro_descripcion: this.form.value.pro_descripcion,
        cat_id: this.form.value.cat_id,
        pro_iva: this.form.value.pro_iva,
        pro_costo: this.form.value.pro_costo,
        pro_pvp: this.form.value.pro_pvp,
        pro_imagen: this.form.value.pro_imagen
      }
    ).subscribe(respuesta => {
      console.log('Producto actualizado');
      //Formulario reseteado
      this.form.reset();
      //Se cargue los datos despues de enviar
      this.cargarProductos();

    }
    );

  }

}
