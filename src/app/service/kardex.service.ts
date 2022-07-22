import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
    providedIn: 'root'
})
export class kardexService {

    apiUrl:string="https://api-modulo-inventario.herokuapp.com"

    constructor(private http: HttpClient) { }

    public getKardexById(pro_id: number) {
        const url = this.apiUrl + `/kardex/id/` + pro_id
        return this.http.get(url)
    }

}