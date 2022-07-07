import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class AjusteService {

  apiUrl:string="http://localhost:4000"

  constructor(private http:HttpClient) { }

  //Metodos
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
  
  public putUpdateAjuste(body:any){
    const url=this.apiUrl+`/ajustes/`
    return this.http.put(url,body)
  }
}
