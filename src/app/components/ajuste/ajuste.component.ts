import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AjusteService } from 'src/app/service/ajuste.service';
import { ModelAjuste } from 'src/app/model/ajuste.model';

@Component({
  selector: 'app-ajuste',
  templateUrl: './ajuste.component.html',
  styleUrls: ['./ajuste.component.css']
})
export class AjusteComponent implements OnInit {

  ajustes: ModelAjuste[] = [];

  constructor(private ajusteService: AjusteService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.cargarAjustes()
  }

  public cargarAjustes() {
    this.ajusteService.getAjustes().subscribe(
      (ajuste: any) => {
        for (let index = 0; index < ajuste.length; index++) {
          let suma:number=0

          for (let j = 0; j < ajuste[index].aju_detalle.length; j++) {

            suma+=Math.abs(parseInt(ajuste[index].aju_detalle[j].aju_det_cantidad))            
          }
          ajuste[index].aju_cantidad_ajuste=suma
          let fecha=new Date(ajuste[index].aju_fecha)
          ajuste[index].aju_fecha=fecha.toLocaleDateString('es-es', { weekday:"short", year:"numeric", month:"long", day:"numeric"})
        }
        this.ajustes = ajuste
        console.log(this.ajustes)
      }, (error) => console.log(error)
    )
  }

}
