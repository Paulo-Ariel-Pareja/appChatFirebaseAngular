import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  private chats: Mensaje[] = [];

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    
   }

  login(proveedor: string) {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

   cargarMensajes(){

    this.itemsCollection = this.afs.collection<Mensaje>('chats'
            , ref => ref.orderBy('fecha', 'desc')
                        .limit(5) );

      return this.itemsCollection.valueChanges().pipe(
                                 map( (mensajes: Mensaje[]) => {
                                   console.log( mensajes );
                                   this.chats = [];
                                   for( let mensaje of mensajes ){
                                     this.chats.unshift( mensaje );
                                   }
                                   return this.chats;
                                 }));
   }

   agregarMensaje( texto: string){
     //falta id para cuando se auth
    let mensajeEnvia: Mensaje = {
      nombre: 'nombre demo',
      mensaje: texto,
      fecha: new Date().getTime()
    }

    return this.itemsCollection.add( mensajeEnvia );
   }
}
