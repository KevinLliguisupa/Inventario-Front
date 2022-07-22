import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { environment } from 'src/environments/environment';
firebase.initializeApp(environment.firebaseConfig)

@Injectable({
  providedIn: 'root'
})
export class StorageService {
 // variable de refeencia para el almacenamiento
 storage = firebase.storage().ref()
  constructor() { }

  async subirImagen(nombre: String ,imgBase64: any){
    try {
      let respuesta = await this.storage.child("users/"+nombre).putString(imgBase64,'data_url')
      console.log(respuesta);
      return await  respuesta.ref.getDownloadURL();
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
