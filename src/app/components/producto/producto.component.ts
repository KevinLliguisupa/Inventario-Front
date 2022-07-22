import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductoService } from 'src/app/service/producto.service';
import { CategoriaService } from 'src/app/service/categoria.service';
import { StorageService } from 'src/app/service/storage.service'
import { ModelProducto } from 'src/app/model/producto.model';
import { ModelCategoria } from 'src/app/model/categoria.model';
import jsPDF from 'jspdf';

import * as FileSaver from 'file-saver';
import autoTable from 'jspdf-autotable'; 

///
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
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
  providers: [MessageService, ConfirmationService]
  /// new
})
export class ProductoComponent implements OnInit {
  //
  productos: ModelProducto[] = [];

  categorias: ModelCategoria[] = [];

  public form!: FormGroup;

  id_producto: any

  searchTerm: string = ''

  cols: any[] = [];

  exportColumns: any[] = [];

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

  product= {
    pro_id: 0,
    pro_nombre: "",
    pro_descripcion: "",
    pro_categoria: "",
    pro_iva: true,
    pro_costo: 0,
    pro_pvp: 0,
    pro_stock: 0
  }

  listaProducto : any[] = []



  imagen_producto: string = "";
  imagen_update: string = "";
  imagen_producto_form: string = "";
  subida: boolean = false;



  constructor(private productoService: ProductoService, private categoriaService: CategoriaService, private formBuilder: FormBuilder,
    private storageService: StorageService) { }

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
      pro_updateimagen: [''],
      pro_stock: ['']
    })


    this.cols = [
      { field: 'pro_id', header: 'Id', customExportHeader: 'ProductoId' },
      { field: 'pro_nombre', header: 'Nombre' },
      { field: 'pro_descripcion', header: 'Descripción' },
      // { field: 'pro_categoria:{cat_nombre , cat_id}', header: 'Categoría' },
      { field: 'pro_iva', header: 'Iva' },
      { field: 'pro_costo', header: 'Costo' },
      { field: 'pro_pvp', header: 'PVP' },
      { field: 'pro_stock', header: 'Stock' },
  ];

  this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field }
    ))
  }


  public cargarProductos() {
    this.productoService.getAllProductos().subscribe(
      (producto: any) => {
        this.productos = producto
        for (let i = 0; i < producto.length; i++) {
          const item = producto[i];
          if (item.pro_estado) {
            item.pro_estEti="Activo"
          }else{
            item.pro_estEti="Inactivo"
          }
        }
        console.log(this.productos)
      }, (error) => console.warn(error)
    )
  }

  public cargarCategorias() {
    this.categoriaService.getCategorias().subscribe(
      (categoria: any) => {
        this.categorias = categoria
        //console.log(this.categorias)
      }, (error) => console.warn(error)
    )
  }


  buscar() {
    console.log(this.searchTerm)
  }


  public mostrarIdCategoria(categoria: String): number {

    let id = 0
    // recorremos la lista categorias
    console.log(this.categorias.length)
    for (let index = 0; index < this.categorias.length; index++) {
      // si la categoria del componente select esta en la lista de categorias
      if (this.categorias[index].cat_nombre == categoria) {
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
      pro_imagen: this.imagen_producto
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
    let imagen = ""

    console.log(this.id_producto)
    console.log(this.form.value.pro_nombre)
    console.log(this.form.value.pro_descripcion)
    console.log(this.mostrarIdCategoria(this.form.value.cat_nombre))
    console.log(this.form.value.pro_iva)
    console.log(this.form.value.pro_costo)
    console.log(this.form.value.pro_pvp)
    // si no se escoge una imagen se deja el link que la imagen ya tiene
    console.log("Imagen del formulario ...............")
    console.log(this.imagen_producto_form)
    console.log("Imagen actualizada ...............")
    console.log(this.imagen_update)
    console.log(this.imagen_update.length)

    if (this.imagen_update.length > 0) {
      console.log("No vacio")
    } else {
      console.log("Vacio")
      this.imagen_update = this.imagen_producto_form
    }
   

    this.informacionProducto.pro_id = this.id_producto
    this.informacionProducto.pro_nombre = this.form.value.pro_nombre
    this.informacionProducto.pro_descripcion = this.form.value.pro_descripcion
    this.informacionProducto.cat_id = this.mostrarIdCategoria(this.form.value.cat_nombre)
    this.informacionProducto.pro_iva = this.form.value.pro_iva;
    this.informacionProducto.pro_costo = this.form.value.pro_costo
    this.informacionProducto.pro_pvp = this.form.value.pro_pvp
    this.informacionProducto.pro_imagen =this.imagen_update
    console.log(this.informacionProducto)
    this.productoService.putUpdateProducto(this.informacionProducto).subscribe(respuesta => {
      console.log(respuesta)
      console.log('Producto editado correctamente.')
      this.cargarProductos()
    }
    );
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Producto actualizado exitosamente',
      showConfirmButton: false,
      timer: 1500
    })


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

  public cambiarEstado(producto: ModelProducto) {
    if (producto.pro_estado) {
      Swal.fire({
        title: '¿Está seguro de desactivar?',
        text: "Esta acción ocultara este ítem de otros apartados del sistema",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#91C788',
        cancelButtonColor: '#FFAAA7',
        confirmButtonText: 'Si, deseo desactivarlo!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.productoService.deleteProducto({
            pro_id: producto.pro_id
          }).subscribe(res => {
            console.log('Producto desactivado correctamente.')
            this.cargarProductos()
          })

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cambiado!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    } else {
      Swal.fire({
        title: '¿Está seguro de activar?',
        text: "Esta acción mostrará este ítem de otros apartados del sistema",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#91C788',
        cancelButtonColor: '#FFAAA7',
        confirmButtonText: 'Si, deseo activarlo!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.productoService.activateProducto({
            pro_id: producto.pro_id
          }).subscribe(res => {
            console.log('Producto activado correctamente.')
            this.cargarProductos()
          })

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cambiado!',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
    }
  }


  cambiarIva(valor:any):String{
    let resp = ""
    if (valor == true) {
      resp = "SI"
    } else {
      resp = "NO"
    }
    return resp
  }

  infoProducto2(producto: any) {
    this.imagen_update = ""
    this.form.controls['pro_updateimagen'].setValue("")
    this.form.controls['pro_id'].disable()
    this.id_producto = producto.pro_id
    this.form.controls['pro_id'].setValue(producto.pro_id)
    this.form.controls['pro_nombre'].setValue(producto.pro_nombre)
    this.form.controls['pro_descripcion'].setValue(producto.pro_descripcion)
    this.form.controls['cat_nombre'].setValue(producto.pro_categoria.cat_nombre)
    this.form.controls['pro_iva'].setValue(producto.pro_iva)
    this.form.controls['pro_costo'].setValue(producto.pro_costo)
    this.form.controls['pro_pvp'].setValue(producto.pro_pvp)
    this.form.controls['pro_imagen'].disable()
    this.form.controls['pro_imagen'].setValue(producto.pro_imagen)
    this.imagen_producto_form = producto.pro_imagen
    console.log("Imagen del formulario ")
    console.log(this.imagen_producto_form)
  }


  public cargaImagen(event: any) {
    let archivo = event.target.files
    let reader = new FileReader();
    let nombre = "img"
    let fecha = Date.now()
    console.log(archivo[0])

    reader.readAsDataURL(archivo[0])
    reader.onloadend = () => {
      this.storageService.subirImagen(nombre + "" + fecha, reader.result).then(urlImagen => {
        console.log(urlImagen)
        this.imagen_producto = String(urlImagen)
      })
    }
    console.log(this.imagen_producto)
  }

  public ActualizarImagen(event: any) {

    let archivo = event.target.files
    let reader = new FileReader();
    let nombre = "img"
    let fecha = Date.now()
    console.log(archivo[0])

    reader.readAsDataURL(archivo[0])
    reader.onloadend = () => {
      this.storageService.subirImagen(nombre + "" + fecha, reader.result).then(urlImagen => {
        console.log(urlImagen)
        this.imagen_update = String(urlImagen)
      })
    }

    console.log("Imagen Subida")


  }

  exportPdf() {

   import("jspdf").then(jsPDF => {
    import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default();
        (doc as any).autoTable(this.exportColumns,this.productos)
        doc.save('products.pdf');
    })
})
  
}


}
