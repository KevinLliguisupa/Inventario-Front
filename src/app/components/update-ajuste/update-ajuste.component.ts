import { Component, OnInit } from '@angular/core';
import { ModelAjuste } from 'src/app/model/ajuste.model';
import { ModelProducto } from 'src/app/model/producto.model';
import { AjusteService } from 'src/app/service/ajuste.service';
import { ProductoService } from 'src/app/service/producto.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-ajuste',
  templateUrl: './update-ajuste.component.html',
  styleUrls: ['./update-ajuste.component.css']
})
export class UpdateAjusteComponent implements OnInit {

  productos: ModelProducto[] = [];
  productosAux: ModelProducto[] = [];
  productosSelected: ModelProducto[] = [];
  numAjuste!: string
  fecha!: Date
  value: boolean = true;
  descip!: string;
  ajusteModificar!: ModelAjuste


  constructor(private ajusteService: AjusteService,
    private productoService: ProductoService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.numAjuste = params['aju_numero']

      }
    )
    this.cargarProductos()
      this.cargarInfoAjuste()
  }

  public cargarProductos() {
    this.productoService.getAllProductos().subscribe(
      (producto: any) => {
        for (let index = 0; index < producto.length; index++) {
          const element = producto[index];
          if (element.pro_iva)
            element.pro_iva_etiqueta = "Si"
          else
            element.pro_iva_etiqueta = "No"

          for (let cont = 0; cont < this.ajusteModificar.aju_detalle.length; cont++) {
            const detalle = this.ajusteModificar.aju_detalle[cont];
            if (element.pro_id == detalle.pro_id) {
              element.aju_det_cantidad = detalle.aju_det_cantidad
              element.pro_activo = true
              this.productosSelected.push(element)
              this.productosAux.unshift(element)
            }

          }
          if (element.pro_estado && !this.productosAux.includes(element)) {
            this.productosAux.push(element)
            element.pro_activo = false
          }
        }
        this.productos = this.productosAux
      }, (error) => console.warn(error)
    )
  }

  public cancelar() {
    Swal.fire({
      icon: 'error',
      title: '¿Cancelar actualización?',
      text: 'La información modificada será eliminada',
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

  public cargarInfoAjuste() {
    this.ajusteService.getAjusteByNum(this.numAjuste).subscribe(
      (ajuste: any) => {
        this.ajusteModificar = ajuste[0]
        this.descip = this.ajusteModificar.aju_descripcion
        this.fecha = new Date(this.ajusteModificar.aju_fecha)
      }, (error) => console.log(error)
    )
  }

  public guardarAjuste() {
    Swal.fire({
      title: '¿Modificar Ajuste?',
      text: "Todos los cambios realizados serán guardados.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#91C788',
      cancelButtonColor: '#FFAAA7',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        //Modificar Ajuste
        let detalles: any[] = []
        for (let index = 0; index < this.productos.length; index++) {
          const producto: any = this.productos[index];
          if (producto.pro_activo) {
            detalles.push({ pro_id: producto.pro_id, aju_det_cantidad: producto.aju_det_cantidad })
          }
        }
        this.ajusteService.putUpdateAjuste({
          aju_numero: this.numAjuste,
          aju_fecha: this.fecha,
          aju_descripcion: this.descip,
          detalles: detalles
        }).subscribe(respuesta => {
          console.log(respuesta);
        });

        let timerInterval: any
        Swal.fire({
          title: this.numAjuste + ' modificado correctamente',
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

}
