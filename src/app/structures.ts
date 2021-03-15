import { tiposFilas } from 'src/app/enumerations'

export class FilaAccion {

    constructor(id, texto, tipo) {
        this.id = id;
        this.texto = texto;
        this.tipo = tipo;
    }

    id: number;
    texto: string;
    tipo: tiposFilas;
}