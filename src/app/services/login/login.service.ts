import { Injectable } from '@angular/core';
import { provideAuth, getAuth, Auth, UserCredential } from '@angular/fire/auth';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private auth: Auth) { }

  login(): Promise<UserCredential> {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  loggout(){
    this.auth.signOut().then(() => {});
  }

  veryfication (email: string){
    // 700 administrador | 555 Usuario general
    // consulta backend = { response: ok, rol: 700 }
  }

}
