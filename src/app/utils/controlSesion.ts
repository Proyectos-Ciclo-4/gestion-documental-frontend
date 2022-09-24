import { ResponseVerify } from "../models/responseVerify";

export class ControlSesion {

    writeSesionUser(data: ResponseVerify) {
        sessionStorage.setItem('docdoc-data', JSON.stringify(data));
    }

    getIdUser(): string {
        const data: ResponseVerify = this.convertSessionStorage();
        return data == null ? null : data._id;
    }

    getTypeUser(): Number {
        const data: ResponseVerify = this.convertSessionStorage();
        return data == null ? null : data.tipo;
    }

    cleanSesionStorage() {
        sessionStorage.removeItem('docdoc-data');
        sessionStorage.clear();
    }

    convertSessionStorage() {
        return JSON.parse(sessionStorage.getItem('docdoc-data')!);
    }
}