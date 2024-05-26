import { TiposFilas } from 'src/app/enumerations'

export class FilaAccion {

    constructor(id: number, texto:string, tipo: TiposFilas) {
        this.id = id;
        this.texto = texto;
        this.tipo = tipo;
        this.sugerencias = new Array<SugerenciaFila>();
    }

    id: number;
    texto: string;
    tipo: TiposFilas;
    sugerencias = new Array<SugerenciaFila>();
}

export class SugerenciaFila {

    constructor(id: number, texto:string, fecha: string) {
        this.id = id;
        this.texto = texto;
        this.fecha = fecha;
    }

    id: number;
    texto: string;
    fecha: string;
}