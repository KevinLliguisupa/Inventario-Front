import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductoService } from 'src/app/service/producto.service';
import { CategoriaService } from 'src/app/service/categoria.service';
import { ModelProducto } from 'src/app/model/producto.model';
import { ModelCategoria } from 'src/app/model/categoria.model';

import Swal from 'sweetalert2';
///
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  ////new
  styles: [`
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `],
    providers: [MessageService,ConfirmationService]
    /// new
})
export class ProductoComponent implements OnInit {
//
  productos: ModelProducto[] = [];

  categorias: ModelCategoria[] = [];

  public form!: FormGroup;

  id_producto: any

  searchTerm: string =''

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



  constructor(private productoService: ProductoService,private categoriaService:CategoriaService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.cargarProductos()
    this.cargarCategorias()
    this.form = this.formBuilder.group({
      pro_id: [''],
      pro_nombre: [''],
      pro_descripcion: [''],
      cat_nombre: [''],
      pro_iva: [''],
      pro_costo: [''],
      pro_pvp: [''],
      pro_imagen: [''],
      pro_stock: ['']
    })
  }

 
  public cargarProductos() {
    this.productoService.getProductos().subscribe(
      (producto: any) => {
        this.productos = producto
        console.log(this.productos)
      }, (error) => console.warn(error)
    )
  }

  public cargarCategorias() {
    this.categoriaService.getCategorias().subscribe(
      (categoria: any) => {
        this.categorias = categoria
        console.log(this.categorias)
      }, (error) => console.warn(error)
    )
  }

  buscar(){
    console.log(this.searchTerm)
  }


  public mostrarIdCategoria(categoria:String): number{

    let id = 0
    // recorremos la lista categorias
    console.log(this.categorias.length)
    for (let index = 0; index < this.categorias.length; index++) {
       // si la categoria del componente select esta en la lista de categorias
      if(this.categorias[index].cat_nombre == categoria){
        // guardar posicion en la variable id para utilizar en la actualizacion y creacion
        id = this.categorias[index].cat_id
      }
      
    }
    console.log(categoria)

    return id
   
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
    let iva = true;
   
    console.log(this.form.value.pro_nombre)
    console.log(this.form.value.pro_descripcion)
    console.log(this.mostrarIdCategoria(this.form.value.cat_nombre))
    console.log("Iva")

    if (this.form.value.pro_iva == null) {
      iva = false
    }
    console.log()
    console.log("Iva---------")
    console.log(this.form.value.pro_costo)
    console.log(this.form.value.pro_pvp)
    console.log(this.form.value.pro_imagen)

    this.productoService.postCreateProducto({
      pro_nombre: this.form.value.pro_nombre,
      pro_descripcion: this.form.value.pro_descripcion,
      cat_id: this.mostrarIdCategoria(this.form.value.cat_nombre),
      pro_iva: iva,
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

  public actualizarProducto() {
    console.log(this.id_producto)
    console.log(this.form.value.pro_nombre)
    console.log(this.form.value.pro_descripcion)
    console.log(this.mostrarIdCategoria(this.form.value.cat_nombre))
    console.log(this.form.value.pro_iva)
    console.log(this.form.value.pro_costo)
    console.log(this.form.value.pro_pvp)
    console.log(this.form.value.pro_imagen)

    Swal.fire({
      position:'center',
      icon:'success',
      title:'Producto actualizado exitosamente',
      showConfirmButton:false,
      timer:1500
    })


    this.informacionProducto.pro_id = this.id_producto
    this.informacionProducto.pro_nombre = this.form.value.pro_nombre
    this.informacionProducto.pro_descripcion = this.form.value.pro_descripcion
    this.informacionProducto.cat_id = this.mostrarIdCategoria(this.form.value.cat_nombre)
    this.informacionProducto.pro_iva =this.form.value.pro_iva;
    this.informacionProducto.pro_costo = this.form.value.pro_costo
    this.informacionProducto.pro_pvp = this.form.value.pro_pvp
    this.informacionProducto.pro_imagen = this.form.value.pro_imagen

    console.log(this.informacionProducto)

    
    this.productoService.putUpdateProducto(this.informacionProducto).subscribe(respuesta => {
      console.log(respuesta)
      console.log('Producto editado correctamente.')
      this.cargarProductos()
    }
    );
   
  }

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

  cambiarIva(valor:any):String{
    let resp = ""
    if (valor==true) {
      resp = "SI"
    } else {
      resp = "NO"
    }
    return resp
  }





  infoProducto2(producto: any){

     console.log(producto.pro_categoria.cat_nombre)
   
      this.form.controls['pro_id'].disable()
      this.id_producto = producto.pro_id
      this.form.controls['pro_id'].setValue(producto.pro_id)
      this.form.controls['pro_nombre'].setValue(producto.pro_nombre)
      this.form.controls['pro_descripcion'].setValue(producto.pro_descripcion)
      this.form.controls['cat_nombre'].setValue(producto.pro_categoria.cat_nombre)
      this.form.controls['pro_iva'].setValue(producto.pro_iva)
      this.form.controls['pro_costo'].setValue(producto.pro_costo)
      this.form.controls['pro_pvp'].setValue(producto.pro_pvp)
      this.form.controls['pro_imagen'].setValue(producto.pro_imagen)
  }
 

  


}