import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  //apiUrl:string="https://api-modulo-inventario.herokuapp.com"
  apiUrl:string="http://localhost:4000"
  

  constructor(private http:HttpClient) { }
  
  public getProductos(){
    const url=this.apiUrl+`/productos`
    return this.http.get(url)
  }

  public getProductosById(pro_id:any){
    const url = '/productos/id/'+pro_id;
    return this.http.get(url)
  }

  public getProductosByName(pro_nombre:any){
    const url=this.apiUrl+`/productos/nombre/`+pro_nombre;
    return this.http.get(url)
  }

  public postCreateProducto(body:any){
    const url=this.apiUrl+`/productos/`
    return this.http.post(url,body)
  }

  public putUpdateProducto(body:any){
    const url=this.apiUrl+`/productos/`
    return this.http.put(url,body)
  }

  public deleteProducto(body:any){
    const url=this.apiUrl+`/productos/delete/`
    return this.http.put(url,body)
  }


}
