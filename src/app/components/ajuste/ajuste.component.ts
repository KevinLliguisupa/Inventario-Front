import { Component, OnInit } from '@angular/core';
import { AjusteService } from 'src/app/service/ajuste.service';
import { ModelAjuste } from 'src/app/model/ajuste.model';
import { ProductoService } from 'src/app/service/producto.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"

@Component({
  selector: 'app-ajuste',
  templateUrl: './ajuste.component.html',
  styleUrls: ['./ajuste.component.css']
})
export class AjusteComponent implements OnInit {

  ajustes: any[] = [];

  constructor(private ajusteService: AjusteService,
    private productoService: ProductoService, private location: Location) { }

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
                detalle.producto=product
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
            console.log('Producto desactivado correctamente.')
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
        icon: 'question',
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
            console.log('Producto activado correctamente.')
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

  public exportPdf(ajuste:any) {

    console.log(ajuste)
    let body=[]
    for (let index = 0; index < ajuste.aju_detalle.length; index++) {
      const detalle = ajuste.aju_detalle[index];
      //Crea el contenido de la tabla (filas)
      body.push({
        proId:detalle.producto.pro_id,
        proNom: detalle.producto.pro_nombre,
        cantidad: detalle.aju_det_cantidad
      })
      }
    
    const doc = new jsPDF('p', 'pt');

    autoTable(doc, {
      //Cabeceras de la tabla
      //dataKey debe coicidir con los atributos de body
      columns: [
        { title: "Id Producto", dataKey: "proId" },
        { title: "Nombre Producto", dataKey: "proNom" },
        { title: "Cantidad", dataKey: "cantidad" },
      ],

      body: body,
      didDrawPage: (dataArg) => {
        doc.text('Detalle del ajuste', dataArg.settings.margin.left, 80);
      }
    });
    doc.save(ajuste.aju_numero+'_report.pdf');


  }

}
