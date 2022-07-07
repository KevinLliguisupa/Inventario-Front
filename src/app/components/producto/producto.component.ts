import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductoService } from 'src/app/service/producto.service';
import { ModelProducto } from 'src/app/model/producto.model';
import Swal from 'sweetalert2';
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
    cat_id: 0,
    pro_iva: true,
    pro_costo: 0,
    pro_pvp: 0,
    pro_imagen: "",
    //pro_stock: 0
  }



  constructor(private productoService: ProductoService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.cargarProductos()
    this.form = this.formBuilder.group({
      pro_id: [''],
      pro_nombre: [''],
      pro_descripcion: [''],
      cat_id: [''],
      pro_iva: [''],
      pro_costo: [''],
      pro_pvp: [''],
      pro_imagen: [''],
      pro_stock: ['']
    })
  }

  // public cambiarIVA(pro_iva:boolean){
  //   if (pro_iva) {
  //     return "Si"
  //   } 
  //   return "No"
  // }

  public cargarProductos() {
    this.productoService.getProductos().subscribe(
      (producto: any) => {
        this.productos = producto
        console.log(this.productos)
      }, (error) => console.warn(error)
    )
  }

  public cargarProductoById() {
    this.productoService.getProductosById(this.form.value.pro_id).subscribe(
      (producto: any) => {
        this.productos = producto
        if (this.productos.length == 0) {
          this.cargarProductos();
        }
        console.log(this.productos)
      },
      (error) => console.warn(error)
    )
  }

  public cargarProductoByName() {
    this.productoService.getProductosByName(this.form.value.pro_nombre).subscribe(
      (producto: any) => {
        this.productos = producto
        if (this.productos.length == 0) {
          this.cargarProductos();
        }
        console.log(this.productos)
      },
      (error) => console.warn(error)
    )
  }

  public crearProducto() {
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
    this.productoService.putUpdateProducto({
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
      //Se cargue los datos despues de enviar
      console.log('Producto editado correctamente.')
      this.form.reset();
      this.cargarProductos()

    }
    );
  }

  // Swal.fire({
  //   title: '¿Está seguro de borrar?',
  //   text: "No podrá revertir esta acción!",
  //   icon: 'question',
  //   showCancelButton: true,
  //   confirmButtonColor: '#91C788',
  //   cancelButtonColor: '#FFAAA7',  
  //   confirmButtonText: 'Si, deseo eliminar!',
  //   cancelButtonText: 'Cancelar'
  // }).then((result) => {
  //   if (result.isConfirmed) {
  //     this.categoriaService.deleteCat({
  //       cat_id: cat_id
  //     }).subscribe(res => {
  //       console.log('Categoria eliminada correctamente.')
  //       this.form.reset();
  //       this.cargarCategorias()
  //     })

  //     Swal.fire(
  //       'Eliminada!',
  //       'La categoría ha sido eliminada.',
  //       'success'
  //     )
  //   }
  // })

  public borrarProducto(pro_id: any) {
    Swal.fire({
      title: '¿Está seguro de borrar?',
      text: "No podrá revertir esta acción!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#91C788',
      cancelButtonColor: '#FFAAA7',
      confirmButtonText: 'Si, deseo eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProducto({
          pro_id: pro_id
        }).subscribe(res => {
          console.log('Producto eliminado correctamente.')
          this.form.reset();
          this.cargarProductos()
        })

        Swal.fire(
          'Eliminada!',
          'La categoría ha sido eliminada.',
          'success'
        )
      }
    })
  }

  public infoUpdateProducto(pro_id: any, pro_nombre: any, pro_descripcion: any, cat_id: any,
    pro_iva: any, pro_costo: any, pro_pvp: any, pro_imagen: any) {
    this.informacionProducto.pro_id = pro_id;
    this.informacionProducto.pro_nombre = pro_nombre;
    this.informacionProducto.pro_descripcion = pro_descripcion;
    this.informacionProducto.cat_id = cat_id;
    this.informacionProducto.pro_iva = pro_iva;
    this.informacionProducto.pro_costo = pro_costo;
    this.informacionProducto.pro_pvp = pro_pvp;
    this.informacionProducto.pro_imagen = pro_imagen;
  }


}