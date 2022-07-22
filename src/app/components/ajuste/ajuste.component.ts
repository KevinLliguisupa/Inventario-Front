import { Component, OnInit } from '@angular/core';
import { AjusteService } from 'src/app/service/ajuste.service';
import { ModelAjuste } from 'src/app/model/ajuste.model';
import { ProductoService } from 'src/app/service/producto.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";


@Component({
  selector: 'app-ajuste',
  templateUrl: './ajuste.component.html',
  styleUrls: ['./ajuste.component.css']
})
export class AjusteComponent implements OnInit {

  ajustes: any[] = [];
  //returns number of pages created

  constructor(private ajusteService: AjusteService,
    private productoService: ProductoService, private location: Location,) { }

  ngOnInit(): void {
    this.cargarAjustes();
    this.aumentarInfo();
  }

  public cargarAjustes() {
    this.ajusteService.getAllAjustes().subscribe(
      (ajuste: any) => {
        for (let index = 0; index < ajuste.length; index++) {
          let suma: number = 0
          for (let j = 0; j < ajuste[index].aju_detalle.length; j++) {
            suma += Math.abs(parseInt(ajuste[index].aju_detalle[j].aju_det_cantidad))
          }
          ajuste[index].aju_cantidad_ajuste = suma
          let fecha = new Date(ajuste[index].aju_fecha)
          ajuste[index].aju_fecha = fecha.toLocaleDateString('es-es', { year: "numeric", month: "long", day: "numeric" })
          if (ajuste[index].aju_estado) {
            ajuste[index].aju_estado_etiqueta = "Activo"
          } else {
            ajuste[index].aju_estado_etiqueta = "Inactivo"
          }
          ajuste[index].aju_modificable = ajuste[index].aju_detalle[0].aju_det_modificable
        }
        this.ajustes = ajuste
      }, (error) => console.log(error)
    )
  }

  public aumentarInfo() {
    this.productoService.getAllProductos().subscribe(
      (producto: any) => {

        for (let index = 0; index < this.ajustes.length; index++) {
          let ajuste = this.ajustes[index];
          for (let cont = 0; cont < ajuste.aju_detalle.length; cont++) {
            let detalle = ajuste.aju_detalle[cont];
            for (let contp = 0; contp < producto.length; contp++) {
              const product = producto[contp];
              if (product.pro_id == detalle.pro_id) {
                detalle.producto = product
              }
            }
          }
        }
      }, (error) => console.warn(error)
    )
  }

  public cambiarEstado(ajuste: ModelAjuste) {
    if (ajuste.aju_estado) {
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
          this.ajusteService.deleteAjuste({
            aju_numero: ajuste.aju_numero
          }).subscribe(res => {
            console.log('Ajuste desactivado correctamente.')
            this.cargarAjustes()
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
          this.ajusteService.activateAjuste({
            aju_numero: ajuste.aju_numero
          }).subscribe(res => {
            console.log('Ajuste activado correctamente.')
            this.cargarAjustes()
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

  public imprimir(ajuste: any) {
    Swal.fire({
      title: '¿Desea imprimir?',
      text: "Al imprimir ya no podrá editar este ajuste nuevamente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#91C788',
      cancelButtonColor: '#FFAAA7',
      confirmButtonText: 'Si, imprimirlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.generatePdf(ajuste)
        this.ajusteService.cambiarModificar({
          aju_numero: ajuste.aju_numero
        }).subscribe(res => {
          this.cargarAjustes()
        })

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Documento generado!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })

  }

  public generatePdf(ajuste: any) {

    let body = []
    for (let index = 0; index < ajuste.aju_detalle.length; index++) {
      const detalle = ajuste.aju_detalle[index];
      //Crea el contenido de la tabla (filas)

      body.push([
        detalle.producto.pro_id + "\n",
        detalle.producto.pro_nombre,
        detalle.producto.pro_categoria.cat_nombre,
        detalle.producto.pro_descripcion,
        detalle.producto.pro_pvp,
        detalle.aju_det_cantidad])
    }

    let props: any = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: ajuste.aju_numero,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: "https://cdn-icons-png.flaticon.com/512/5164/5164023.png",
        type: 'PNG',
        width: 35,
        height: 35,
        margin: {
          top: 0,
          left: 0
        }
      },
      business: {
        name: "Modulo Inventario"
      },
      contact: {
        label: "Ajuste de producto",
        name: ajuste.aju_numero,
        address: " ",
        phone: "Concepto del ajuste:",
        email: ajuste.aju_descripcion,
        otherInfo: " ",
      },
      invoice: {
        label: ' ',
        num: ajuste.aju_fecha,
        header: [
          {
            title: "Cod.",
            style: {
              width: 10
            }
          },
          {
            title: "Nom. Prod.",
            style: {
              width: 40
            }
          },
          {
            title: "Categoria",
            style: {
              width: 30
            }
          },
          {
            title: "Descipcion",
            style: {
              width: 75
            }
          },
          { title: "Precio" },
          { title: "Cantidad" }
        ],
        table: body,
        additionalRows: [{
          col1: 'Total productos modificados:',
          col2: ajuste.aju_cantidad_ajuste.toString(),
          style: {
            fontSize: 14
          }
        }],
      },
      footer: {
        text: "Documento creado únicamente con fines educativos.",
      },
      pageEnable: true,
      pageLabel: "Page ",
    }
    jsPDFInvoiceTemplate(props);

  }

}
