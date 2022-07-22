import { EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AjusteService {
  @Output() disparador:EventEmitter<any> = new EventEmitter();

  apiUrl:string="https://api-modulo-inventario.herokuapp.com"
  // apiUrl:string="http://localhost:4000"

  constructor(private http:HttpClient) { }

  //Metodos
  public getAllAjustes(){
    const url=this.apiUrl+`/allajustes`
    return this.http.get(url)
  }
  //Obtener todos los ajustes
  public getAjustes(){
    const url=this.apiUrl+`/ajustes`
    return this.http.get(url)
  }

  //Obtener el numero de ajuste
  public getnumero(){
    const url=this.apiUrl+`/ajustes/numero`
    return this.http.get(url)
  }

  //Crud Ajustes
  public postCreateAjuste(body:any){
    const url=this.apiUrl+`/ajustes/completo/`
    return this.http.post(url,body)
  }

  //Obtener ajuste por numero
  public getAjusteByNum(numero:string){
    const url=this.apiUrl+`/ajustes/numero/`+numero
    return this.http.get(url)
  }

  public putUpdateAjuste(body:any){
    const url=this.apiUrl+`/ajustes/`
    return this.http.put(url,body)
  }

  public deleteAjuste(body:any){
    const url=this.apiUrl+`/ajustes/delete/`
    return this.http.put(url,body)
  }

  public activateAjuste(body:any){
    const url=this.apiUrl+`/ajustes/activate/`
    return this.http.put(url,body)
  }

  public cambiarModificar(body:any){
    const url=this.apiUrl+`/ajustes/modificable/`
    return this.http.put(url,body)
  }
}
