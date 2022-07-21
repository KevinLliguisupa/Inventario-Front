import { Component, OnInit } from '@angular/core';
import { ModelProducto } from 'src/app/model/producto.model';
import { AjusteService } from 'src/app/service/ajuste.service';
import { ProductoService } from 'src/app/service/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-ajuste',
  templateUrl: './create-ajuste.component.html',
  styleUrls: ['./create-ajuste.component.css']
})
export class CreateAjusteComponent implements OnInit {

  productos: ModelProducto[] = [];
  productosSelected: ModelProducto[] = [];
  numAjuste!: number
  fecha!: Date
  descip!: string;

  constructor(private ajusteService: AjusteService, private productoService: ProductoService,) { }


  ngOnInit(): void {
      this.fecha = new Date()
      this.descip = ""
    this.getNumAjuste()
    this.cargarProductos()
  }

  public cargarProductos() {
    this.productoService.getProductos().subscribe(
      (producto: any) => {
        for (let index = 0; index < producto.length; index++) {
          const element = producto[index];
          if (element.pro_iva)
          element.pro_iva_etiqueta="Si"
          else
          element.pro_iva_etiqueta="No"
        }
        this.productos = producto
      }, (error) => console.warn(error)
    )
  }

  public getNumAjuste() {
    this.ajusteService.getnumero().subscribe(
      (numero: any) => {
        this.numAjuste = numero.get_nroajuste
      }, (error) => console.log(error)
    )
  }

  public crearAjuste() {
    Swal.fire({
      title: '¿Crear Ajuste?',
      text: "La información será guardada con posibilidad de modificarla.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#91C788',
      cancelButtonColor: '#FFAAA7',
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        let detalles: any[] = []
        for (let index = 0; index < this.productosSelected.length; index++) {
          const element = this.productosSelected[index];
          detalles.push({ pro_id: element.pro_id, aju_det_cantidad: element.aju_det_cantidad })
        }
        this.ajusteService.postCreateAjuste({
          aju_fecha: this.fecha,
          aju_descripcion: this.descip,
          detalles: detalles
        }).subscribe(respuesta => {
          console.log(respuesta);
        });
        let timerInterval: any
        Swal.fire({
          title: this.numAjuste + ' creado correctamente',
          html: 'Regresando a la lista de ajustes.',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          this.productos = [];
          this.productosSelected = [];
          window.location.href = "/ajustes";
        })

      }
    })
  }

  public cancelar() {
    Swal.fire({
      icon: 'error',
      title: '¿Cancelar creación?',
      text: 'La información ingresada sera eliminada',
      showCancelButton: true,
      confirmButtonColor: '#91C788',
      cancelButtonColor: '#FFAAA7',
      confirmButtonText: 'Continuar editando',
      cancelButtonText: 'Salir'
    }).then((result) => {
      if (result.isDismissed) {
        window.location.href = "/ajustes";
      }
    })
  }
}
