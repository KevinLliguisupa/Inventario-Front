import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { kardexService } from 'src/app/service/kardex.service';
import { ActivatedRoute } from '@angular/router';
import { modelKardex } from 'src/app/model/kardex.model';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.css']
})
export class KardexComponent implements OnInit {

  kardex: any[] = []
  pro_id!: number
  movimientos: any[]=[]

  @ViewChild('expanded') button!:ElementRef;

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

  public cargarKardex(){
    this.kardexService.getKardexById(this.pro_id).subscribe(
      (kardex:any)=>{
        for (let i = 0; i < kardex.movimientos.length; i++) {
          const movimiento = kardex.movimientos[i];
          if (movimiento.tipo=='Ajuste') {
            movimiento.imagen='../../../assets/images/ajuste.png'
            if (parseInt(movimiento.cantidad)>0) {
              movimiento.cantidad='+'+movimiento.cantidad
            }
          }else if (movimiento.tipo=='Venta'){
            movimiento.imagen='../../../assets/images/venta.png'
            movimiento.cantidad='-'+movimiento.cantidad
          }else{
            movimiento.imagen='../../../assets/images/compra.png'
            movimiento.cantidad='+'+movimiento.cantidad
          }
          let fecha = new Date(movimiento.fecha)
          movimiento.fecha=fecha.toLocaleDateString('es-es', { year: "numeric", month: "long", day: "numeric" })
        }
        this.kardex.push(kardex)
        this.movimientos=this.kardex[0].movimientos
        console.log(this.movimientos)
      },
      (error)=>console.log(error)
    )
  }





}
