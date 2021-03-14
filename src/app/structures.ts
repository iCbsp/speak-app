import { tiposFilas } from 'src/app/enumerations'

export class FilaAccion {

    constructor(texto, tipo) {
        this.texto = texto;
        this.tipo = tipo;
    }

    texto: string;
    tipo: tiposFilas;
}