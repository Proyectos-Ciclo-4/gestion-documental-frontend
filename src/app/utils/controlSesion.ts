import { ResponseVerify } from "./models/responseVerify";

export class ControlSesion {

    writeSesionUser(data: ResponseVerify) {
        sessionStorage.setItem('docdoc-data', JSON.stringify(data));
    }

    getIdUser() {
        const data: ResponseVerify = this.convertSessionStorage();
        return data.id_user;
    }

    getRolUser() {
        const data: ResponseVerify = this.convertSessionStorage();
        return data.rol;
    }

    convertSessionStorage() {
        return JSON.parse(sessionStorage.getItem('docdoc-data')!);
    }
}