import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { kardexService } from 'src/app/service/kardex.service';
import { ActivatedRoute } from '@angular/router';

import jsPDFInvoiceTemplate, { OutputType, jsPDF } from "jspdf-invoice-template";

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.css']
})
export class KardexComponent implements OnInit {

  kardex: any[] = []
  pro_id!: number
  movimientos: any[] = []

  @ViewChild('expanded') button!: ElementRef;

  constructor(
    private kardexService: kardexService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        this.pro_id = params['pro_id']

      }
    )
    this.cargarKardex()


  }

  public cargarKardex() {
    this.kardexService.getKardexById(this.pro_id).subscribe(
      (kardex: any) => {
        for (let i = 0; i < kardex.movimientos.length; i++) {
          const movimiento = kardex.movimientos[i];
          if (movimiento.tipo == 'Ajuste') {
            movimiento.imagen = '../../../assets/images/ajuste.png'
            if (parseInt(movimiento.cantidad) > 0) {
              movimiento.cantidad = '+' + movimiento.cantidad
            }
          } else if (movimiento.tipo == 'Venta') {
            movimiento.imagen = '../../../assets/images/venta.png'
            movimiento.cantidad = '-' + movimiento.cantidad
          } else {
            movimiento.imagen = '../../../assets/images/compra.png'
            movimiento.cantidad = '+' + movimiento.cantidad
          }
          let fecha = new Date(movimiento.fecha)
          movimiento.fecha = fecha.toLocaleDateString('es-es', { year: "numeric", month: "long", day: "numeric" })
        }
        this.kardex.push(kardex)
        this.movimientos = this.kardex[0].movimientos
        console.log(this.kardex)
      },
      (error) => console.log(error)
    )
  }

  public imprimir() {

    const producto = this.kardex[0]

    let body = []
    for (let index = 0; index < producto.movimientos.length; index++) {
      const movimiento = producto.movimientos[index];
      //Crea el contenido de la tabla (filas)

      body.push([
        movimiento.num=index+1,
        movimiento.id+"\n",
        movimiento.fecha,
        movimiento.descipcion,
        movimiento.cantidad,
        movimiento.stock])
    }

    let props: any = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: "kard-"+producto.pro_nombre,
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
        name: "Módulo Inventario"
      },
      contact: {
        label: "Kardex de producto",
        name: producto.pro_nombre,
        address: " ",
        phone: producto.pro_categoria,
        email: "precio: " + producto.pro_pvp + " $",
        otherInfo: " ",
      },
      invoice: {
        // label: "Stock Actual:",
        // num: producto.pro_stock,
        header: [
          {
            title: "#",
            style: {
              width: 12
            }
          },
          {
            title: "Documento",
            style: {
              width: 35
            }
          },
          {
            title: "\tFecha",
            style: {
              width: 50
            }
          },
          {
            title: "\tDescipción",
            style: {
              width: 55
            }
          },
          {
            title: "Cantidad",
            style: {
              width: 20
            }
          },
          { title: "Stock" }
        ],
        table: body,
        additionalRows: [{
          col1: 'Stock Actual:',
          col2: producto.pro_stock.toString(),
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
