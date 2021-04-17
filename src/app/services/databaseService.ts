import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';

import { FilaAccion } from 'src/app/structures';
import { TiposAcciones, TiposFilas } from 'src/app/enumerations';

@Injectable()
export class DatabaseService {

    private database: SQLiteObject;
    public messages = [];
    public lista = new BehaviorSubject<boolean>(false);
    public cambio = new BehaviorSubject<boolean>(false);
    private usuarioActual = 0;

    constructor(
        private platform:Platform, 
        private sqlite:SQLite
        ) {

        // Creacion de la base de datos
        if(!platform.is('desktop')) this.platform.ready().then(() => {
            let conexion = this.sqlite.create({
                name: 'database.db',
                location: 'default'
            });

            if(conexion) conexion.then((db: SQLiteObject) => {
                //this.message = JSON.stringify(db);
                this.messages.push("BD creada");
                this.database = db;
                this.creaTablas();
                this.comprobacionDatos();
            });
            else alert("Error creando la base de datos");
        });
    }
    public getIdUsuarioActual() { return this.usuarioActual; }

    public alertDatabaseInfo(){
        alert("Base de datos: " + this.lista.value);
        this.database.executeSql(`SELECT * FROM usuario;`, [])
            .then((usuarios)=>{
                alert("Usuarios: " + usuarios.rows.length);
                this.database.executeSql(`SELECT * FROM configuracion;`, [])
                    .then((configuraciones)=>{
                        alert("Configuraciones: " + configuraciones.rows.length);
                        this.database.executeSql(`SELECT * FROM asistente;`, [])
                            .then((asistentes)=>{
                                alert("Asistentes: " + asistentes.rows.length);
                                this.database.executeSql(`SELECT * FROM accion;`, [])
                                    .then((acciones)=>{
                                        alert("Acciones: " + acciones.rows.length);
                                        this.database.executeSql(`SELECT * FROM fila;`, [])
                                            .then((filas)=>{
                                                alert("Filas: " + filas.rows.length);
                                                this.database.executeSql(`SELECT * FROM sugerencia;`, [])
                                                .then((sugerencias)=>{
                                                    alert("Sugerencias: " + sugerencias.rows.length);
                                                })
                                                .catch((err) => alert("Error contando sugerencias -> " + JSON.stringify(err))
                                                );
                                            })
                                            .catch((err) => alert("Error contando filas -> " + JSON.stringify(err))
                                        );
                                    })
                                    .catch((err) => alert("Error contando acciones -> " + JSON.stringify(err))
                                );
                            })
                            .catch((err) => alert("Error contando asistentes -> " + JSON.stringify(err))
                        );
                    })
                    .catch((err) => alert("Error contando configuraciones -> " + JSON.stringify(err))
                );
            })
            .catch((err) => alert("Error contando usuarios -> " + JSON.stringify(err))
        );
    }

    private creaTablas() {

        this.database.executeSql("PRAGMA foreign_keys = ON");

        // Usuario
        this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS usuario (
            id INTEGER primary key,
            nombre TEXT,
            color TEXT,
            fecha_ultimo_inicio TEXT
        );`, [])
        .then(() => this.messages.push("Tabla de usuario creada"))
        .catch((err) => alert("Error creando la tabla usuario -> " + JSON.stringify(err)));
        
        // Asistente
        this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS asistente (
            id INTEGER primary key,
            inicial TEXT,
            final TEXT
        );`, [])
        .then(() => this.messages.push("Tabla de asistente creada"))
        .catch((err) => alert("Error creando la tabla asistente -> " + JSON.stringify(err)));

        // Configuracion
        this.database.executeSql(
            `CREATE TABLE IF NOT EXISTS configuracion (
                id INTEGER primary key,
                usuario INTEGER,
                asistente INTEGER,
                modo_simple INTEGER,
                respuesta INTEGER,
                FOREIGN KEY(usuario) REFERENCES usuario(id) ON DELETE CASCADE
                );`, [])
                .then(() => this.messages.push("Tabla de configuracion creada"))
                .catch((err) => alert("Error creando la tabla configuracion -> " + JSON.stringify(err)));
        //FOREIGN KEY(asistente) REFERENCES asistente(id)
                

        // Accion
        this.database.executeSql(
            `CREATE TABLE IF NOT EXISTS accion (
                id INTEGER primary key,
                usuario INTEGER,
                tipo INTEGER,
                titulo TEXT,
                imagen TEXT,
                orden_filas TEXT,
                ultimo_uso TEXT,
                FOREIGN KEY(usuario) REFERENCES usuario(id) ON DELETE CASCADE
            );`, [])
            .then(() => this.messages.push("Tabla de accion creada"))
            .catch((err) => alert("Error creando la tabla accion -> " + JSON.stringify(err)));

        // Fila
        this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS fila (
            id INTEGER primary key,
            accion INTEGER,
            tipo INTEGER,
            texto TEXT,
            FOREIGN KEY(accion) REFERENCES accion(id) ON DELETE CASCADE
        );`, [])
        .then(() => this.messages.push("Tabla de fila creada"))
        .catch((err) => alert("Error creando la tabla fila -> " + JSON.stringify(err)));


        // Sugerencia
        this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS sugerencia (
            id INTEGER primary key,
            fila INTEGER,
            texto TEXT,
            fecha_ultimo_uso TEXT,
            FOREIGN KEY(fila) REFERENCES fila(id) ON DELETE CASCADE
        );`, [])
        .then(() => this.messages.push("Tabla de sugerencia creada"))
        .catch((err) => alert("Error creando la tabla sugerencia -> " + JSON.stringify(err)));

    }
        
    private insercionesIniciales() {
        // Igual esto deberia de ser una transaccion (??????)
        
        this.insertaAsistente("Alexa 🌀", "");
        this.insertaAsistente("Ok Google 🎨", "");
        this.insertaAsistente("Siri 🔮", "");
        
        this.publicaUsuario("Usuario", "#32a852").then(() => {
            this.lista.next(true);
        });

        // this.insertaUsuario("Usuario", "#32a852").then((usuario) => {
        //     this.insertaConfiguracion(usuario.insertId).then(() => this.lista.next(true));
        // });
        
    }

    private comprobacionDatos(){
        this.database.executeSql(
        `SELECT * FROM usuario ORDER BY fecha_ultimo_inicio DESC;`, [])
        .then((usuarios)=>{
            if(!usuarios.rows.length){
                alert("Base de datos vacía, insertando datos iniciales");
                this.insercionesIniciales();
            } else {
                //alert("Hay base de datos, iniciada la sesion del usuario " + usuarios.rows.item(0).id);
                this.usuarioActual = usuarios.rows.item(0).id;
                this.lista.next(true);
            }
            // alert("idUsuario: " + this.usuarioActual);
        })
        .catch((err) => {
            alert("Error contando usuarios (comprobacionDatos) -> " + JSON.stringify(err));
        })
    }

    public async borraBDD(){
        await this.sqlite.deleteDatabase({
            name: "database.db",
            location: "default"
        });
    }

    public async obtenConfiguracion(){
        let configuracion: any;
        await this.database.executeSql(
            `SELECT * FROM configuracion WHERE usuario = ${this.usuarioActual}`, [])
        .then((configuraciones)=>{
            if(configuraciones.rows.length){
                configuracion = configuraciones.rows.item(0);
            } else alert("obtenConfiguracion: No hay configuracion");
        })
        .catch((err) => {
            alert("Error obteniendo la configuracion -> " + JSON.stringify(err));
        });
        return configuracion;
    }

    public async obtenUsuariosAlfabeticamente(){
        let listaUsuarios: any;
        await this.database.executeSql(`SELECT * FROM usuario ORDER BY nombre ASC;`, []).then((usuarios)=>{
            if(usuarios.rows.length) listaUsuarios = usuarios.rows;
            else alert("obtenUsuariosAlfabeticamente: No hay usuarios");
        })
        .catch((err) => alert("Error obteniendo los usuarios -> " + JSON.stringify(err)));
        return listaUsuarios;
    }
    
    public async obtenUsuariosSesion(){
        let listaUsuarios: any;
        await this.database.executeSql(`SELECT * FROM usuario ORDER BY fecha_ultimo_inicio DESC;`, []).then((usuarios)=>{
            if(usuarios.rows.length) listaUsuarios = usuarios.rows;
            else alert("obtenUsuariosSesion: No hay usuarios");
        })
        .catch((err) => alert("Error obteniendo los usuarios -> " + JSON.stringify(err)));
        return listaUsuarios;
    }

    public async obtenAsistentes(){
        let listaAsistentes: any;
        await this.database.executeSql(`SELECT * FROM asistente;`, []).then((asistentes)=>{
            if(asistentes.rows.length) listaAsistentes = asistentes.rows;
            // else alert("obtenAsistentes: No hay asistentes");
        })
        .catch((err) => alert("Error obteniendo los asistentes -> " + JSON.stringify(err)));
        return listaAsistentes;
    }
    
    public async obtenUsuario(usuarioID : number){
        let usuario: any;
        await this.database.executeSql(`SELECT * FROM usuario WHERE id = ${usuarioID}`, [])
        .then((usuarios)=>{
            if(usuarios.rows.length) usuario = usuarios.rows.item(0);
            else alert("obtenUsuario: No existe ese usuario");
        })
        .catch((err) => alert("Error en obtenUsuario -> " + JSON.stringify(err)));
        return usuario;
    }

    public async obtenAsistenteDeUsuario(usuarioID? : number){
        let asistente = null;
        if(usuarioID == undefined) usuarioID = this.usuarioActual;
        await this.database.executeSql(`SELECT * FROM asistente, configuracion WHERE configuracion.asistente = asistente.id AND configuracion.usuario = ${usuarioID};`, [])
        .then((asistentes)=>{
            if(asistentes.rows.length) asistente = asistentes.rows.item(0);
            // else alert("obtenAsistente: No existe ese asistente");
        })
        .catch((err) => alert("Error en obtenAsistenteDeUsuario -> " + JSON.stringify(err)));
        return asistente;
    }

    public async obtenInfoAccion(id: number){
        let accion = null;
        await this.database.executeSql(`SELECT * FROM accion WHERE id = ${id};`, [])
        .then((accionBDD)=>{
            if(accionBDD.rows.length) accion = accionBDD.rows.item(0);
        })
        .catch((err) => alert("Error en obtenAcciones -> " + JSON.stringify(err)));
        return accion;
    }

    public async obtenAcciones(tipo : TiposAcciones, usuario? : number){
        let acciones = null;
        if(usuario == undefined) usuario = this.usuarioActual;
            
        await this.database.executeSql(`SELECT * FROM accion WHERE tipo = ${tipo} AND usuario = ${usuario};`, [])
        .then((accionesBDD)=>{
            acciones = accionesBDD.rows;
        })
        .catch((err) => alert("Error en obtenAcciones -> " + JSON.stringify(err)));
        return acciones;
    }

    public async obtenFilas(accion : number){
        let filas = null;
            
        await this.database.executeSql(`SELECT * FROM fila WHERE accion = ${accion};`, [])
        .then((filasBDD)=>{
            if(filasBDD && filasBDD.rows.length) filas = filasBDD.rows;
            else alert("obtenFilas: Esta acción no tiene filas");
        })
        .catch((err) => alert("Error en obtenFilas -> " + JSON.stringify(err)));
        return filas;
    }
    
    public async obtenSugerencias(fila: number){
        let sugerencias = null;
            
        await this.database.executeSql(`SELECT * FROM sugerencia WHERE fila = ${fila} ORDER BY fecha_ultimo_uso DESC;`, [])
        .then((sugerenciasBDD)=>{
            if(sugerenciasBDD && sugerenciasBDD.rows.length) sugerencias = sugerenciasBDD.rows;
            // else alert("obtenSugerencias: Esta fila no tiene sugerencias");
        })
        .catch((err) => alert("Error en obtenSugerencias -> " + JSON.stringify(err)));
        return sugerencias;
    }
    
    public cambiaModoSimple(modoSimpleBool: boolean){
        let modoSimpleInt = 0;
        if(modoSimpleBool) modoSimpleInt = 1;
        this.database.executeSql(
            `UPDATE configuracion SET modo_simple = ${modoSimpleInt} WHERE usuario = ${this.usuarioActual} `, [])
        .then(() => this.cambio.next(!this.cambio.value))
        .catch((err) => {
            alert("Error actualizando modo_simple -> " + JSON.stringify(err));
        });
    }

    public cambiaRespuesta(respuestaBool: boolean){
        let respuestaInt = 0;
        if(respuestaBool) respuestaInt = 1;
        return this.database.executeSql(
            `UPDATE configuracion SET respuesta = ${respuestaInt} WHERE usuario = ${this.usuarioActual} `, [])
        .then(() => this.cambio.next(!this.cambio.value))
        .catch((err) => {
            alert("Error actualizando respuesta -> " + JSON.stringify(err));
        });
    }

    public cambiaUsuarioActual(nuevoUsuario : number){
        // Se deberian de hacer comprobaciones antes?
        this.usuarioActual = nuevoUsuario;
        this.database.executeSql(
            `UPDATE usuario SET fecha_ultimo_inicio = datetime('now') WHERE id = ${this.usuarioActual} `, [])
        .then(() => this.cambio.next(!this.cambio.value))
        .catch((err) => {
            alert("Error actualizando usuario -> " + JSON.stringify(err));
        });
    }
    
    public cambiaAsistente(nuevoAsistente : number){
        this.database.executeSql(
            `UPDATE configuracion SET asistente = ${nuevoAsistente} WHERE usuario = ${this.usuarioActual}`, [])
        .then(() => this.cambio.next(!this.cambio.value))
        .catch((err) => {
            alert("Error actualizando asistente -> " + JSON.stringify(err));
        });
    }

    public publicaUsuario(nombre : string, color : string) : any{
        return this.insertaUsuario(nombre, color).then((usuario) => {
            return this.insertaConfiguracion(usuario.insertId).then(() => {
                this.usuarioActual = usuario.insertId;
                this.insertaAccionesBasicas(usuario.insertId);
                this.insertaAccionesAplicaciones(usuario.insertId);
                this.cambio.next(!this.cambio.value);
            });
        });
    }

    public publicaAsistente(inicial : string, final : string) : any{
        return this.insertaAsistente(inicial, final).then(() => this.cambio.next(!this.cambio.value));
    }

    public publicaAccion(tipo: TiposAcciones, nombre: string, imagen: string, usuario?: number, filas?: FilaAccion[]){
        // if(!filas || !filas.length) {
        //     alert("Error publicando accion -> La acción debe de tener al menos una fila");
        //     return null;
        // }
        if(usuario == undefined) usuario = this.usuarioActual;
        return this.insertaAccion(this.usuarioActual, tipo, nombre, imagen, "orden").then((accion) => {
            if(filas && filas != undefined) filas.map(fila => {
                this.insertaFila(accion.insertId, fila.tipo, fila.texto);
            });
            this.cambio.next(!this.cambio.value);
        });
    }
    
    public publicaSugerencia(fila: number, texto: string){
        return this.insertaSugerencia(fila, texto).then(() => {
            this.obtenSugerencias(fila).then((sugerencias) => {
                this.cambio.next(!this.cambio.value);
                if(sugerencias.length > 3){
                    this.borraSugerenciasDeFila(fila, sugerencias.length - 3);
                }
            });
        });
    }
    
    private insertaUsuario(nombre : string, color : string){
        if(nombre && color){
            return this.database.executeSql(
                `INSERT INTO usuario(nombre, color, fecha_ultimo_inicio) VALUES ('${nombre}', '${color}', datetime('now'));`, [])
            .catch((err) => {
                alert("Error insertando usuario -> " + JSON.stringify(err));
            });
        } else alert("insertaUsuario: Nombre o color no válido");
    }

    private insertaConfiguracion(usuario : number){
        return this.database.executeSql(
            `INSERT INTO configuracion(usuario, asistente, modo_simple, respuesta) VALUES (${usuario}, 0, 0, 0);`, [])
            .catch((err) => alert("Error insertando configuracion -> " + JSON.stringify(err)));
    }
    
    private insertaAsistente(inicial : string, final : string){
        // if(inicial && final){
            return this.database.executeSql(
                `INSERT INTO asistente(inicial, final) VALUES ('${inicial}', '${final}');`, [])
                .catch((err) => alert("Error insertando asistente -> " + JSON.stringify(err)));
        // } else alert("insertaAsistente: Texto no valido");
    }

    private insertaFila(accion : number, tipo : TiposFilas, textoTemp? : string){
        let texto = "";
        if(textoTemp) texto = textoTemp;

        return this.database.executeSql(
            `INSERT INTO fila(accion, tipo, texto) VALUES (${accion}, ${tipo}, '${texto}');`, [])
        .catch((err) => alert("Error insertando fila -> " + JSON.stringify(err)));
    }
    
    private insertaObjetoFila(idAccion: number, fila: FilaAccion){
        this.insertaFila(idAccion, fila.tipo, fila.texto).then((filaInsertada) => {
            fila.sugerencias.forEach((sugerencia) => {
                this.insertaSugerencia(filaInsertada.insertId, sugerencia.texto);
            });
        });
    }

    private insertaSugerencia(fila : number, texto: string){
        return this.database.executeSql(
            `INSERT INTO sugerencia(fila, texto, fecha_ultimo_uso) VALUES (${fila}, '${texto}', datetime('now'));`, [])
            .catch((err) => alert("Error insertando sugerencia -> " + JSON.stringify(err)));
    }

    private insertaAccion(usuario : number, tipo : TiposAcciones, titulo : string, imagen : string, orden_filas : string){
        // if(inicial && final){
            return this.database.executeSql(
                `INSERT INTO accion(usuario, tipo, titulo, imagen, orden_filas, ultimo_uso) VALUES (${usuario}, ${tipo}, '${titulo}', '${imagen}', '${orden_filas}', datetime('now'));`, [])
                .catch((err) => alert("Error insertando accion -> " + JSON.stringify(err)));
        // } else alert("insertaAccion: Texto no valido");
    }

    public editaUsuario(usuario : number, nombre : string, color : string){
        if(nombre && color){
            return this.database.executeSql(
                `UPDATE usuario SET nombre = '${nombre}', color = '${color}' WHERE id = ${usuario}`, [])
                .then(() => this.cambio.next(!this.cambio.value))
                .catch((err) => alert("Error actualizando usuario -> " + JSON.stringify(err)));
        } else alert("editaUsuario: nombre o color no válidos");
    }

    public editaAsistente(asistente : number, inicial : string, final : string){
        return this.database.executeSql(
            `UPDATE asistente SET inicial = '${inicial}', final = '${final}' WHERE id = ${asistente}`, [])
            .then(() => this.cambio.next(!this.cambio.value))
            .catch((err) => alert("Error actualizando asistente -> " + JSON.stringify(err)));
    }

    public editaAccion(id: number, filas: FilaAccion[], titulo: string, imagen: string){
        let ordenFilas = "";
        return this.database.executeSql(
            `UPDATE accion SET titulo = '${titulo}', imagen = '${imagen}', orden_filas = '${ordenFilas}' WHERE id = ${id}`, [])
            .then(() => {
                return this.borraFilasDeAccion(id).then(() => {
                    if(filas && filas != undefined) filas.map(fila => {
                        this.insertaObjetoFila(id, fila);
                    });
                    this.cambio.next(!this.cambio.value);
                });
            });
        }
        
    public actualizaFechaUltimoUsoSugerenciaId(sugerencia: number){
        return this.database.executeSql(
            `UPDATE sugerencia SET fecha_ultimo_uso = datetime('now') WHERE id = ${sugerencia};`, [])
        .then(() => {
            this.cambio.next(!this.cambio.value);
        });
    }

    public actualizaFechaUltimoUsoSugerenciaTextoFila(sugerencia: string, fila:number){
        return this.database.executeSql(
            `UPDATE sugerencia SET fecha_ultimo_uso = datetime('now') WHERE texto = ${sugerencia} AND fila = ${fila};`, [])
        .then(() => {
            this.cambio.next(!this.cambio.value);
        });
    }

    public borraUsuario(usuario : number){
        // if(usuario){
        //     return this.database.executeSql(
        //         `DELETE FROM configuracion WHERE usuario = ${usuario}`, [])
        //         .then(() => {
        //             return this.database.executeSql(
        //                 `DELETE FROM usuario WHERE id = ${usuario}`, [])
        //                 .then(() => {
        //                     this.obtenUsuariosSesion().then(usuariosBDD => {
        //                         this.usuarioActual = usuariosBDD.rows.item(0).id;
        //                         this.cambio.next(!this.cambio.value);
        //                     });
        //                 })
        //                 .catch((err) => alert("Error borrando usuario -> " + JSON.stringify(err)));
        //         })
        //         .catch((err) => alert("Error borrando configuracion -> " + JSON.stringify(err)));
        // } else alert("borraUsuario: Usuario no valido");
        if(usuario){
            return this.database.executeSql(
                `DELETE FROM usuario WHERE id = ${usuario}`, [])
            .then(() => {
                this.obtenUsuariosSesion().then(usuariosBDD => {
                    if(usuariosBDD.rows.length){
                        this.usuarioActual = usuariosBDD.rows.item(0).id;
                        this.cambio.next(!this.cambio.value);
                    } else {
                        alert("Error: no hay usuarios, creando uno temporal");
                        this.publicaUsuario("Usuario", "#32a852").then(() => {
                            this.lista.next(true);
                            this.cambio.next(!this.cambio.value);
                        });
                    }
                });
            })
            .catch((err) => alert("Error borrando usuario -> " + JSON.stringify(err)));
        } else alert("El valor del usuario no es adecuado");
    }
    
    public borraAsistente(asistenteID : number){
        if(asistenteID){
            return this.database.executeSql(
                `UPDATE configuracion SET asistente = 0 WHERE asistente = ${asistenteID};`, [])
                .finally(() => {
                    return this.database.executeSql(
                        `DELETE FROM asistente WHERE id = ${asistenteID};`, [])
                        .then(() => this.cambio.next(!this.cambio.value))
                        .catch((err) => alert("Error borrando asistente -> " + JSON.stringify(err)));
                })
                // .catch((err) => alert("Error actualizando configuracion -> " + JSON.stringify(err)));
        } else alert("borraAsistente: Usuario no valido");
    }

    public borraAcciones(idAcciones : number[]){
        // let devuelve : Promise<any>;
          
        // if(idAcciones.length){
        //     for(let indiceIdAcciones = 0; indiceIdAcciones < idAcciones.length; indiceIdAcciones++){
        //         devuelve = this.borraFilasDeAccion(idAcciones[indiceIdAcciones])
        //             .finally(() => {
        //                 devuelve = this.database.executeSql(
        //                     `DELETE FROM accion WHERE id = ${idAcciones[indiceIdAcciones]};`, [])
        //                     .then(() => this.cambio.next(!this.cambio.value))
        //                     .catch((err) => alert("Error borrando accion -> " + JSON.stringify(err)));
        //             })
        //     }
        // } else {
        //     alert("borraAcciones: No se han pasado acciones");
        //     devuelve = new Promise(() => {});
        // }

        // return devuelve;
        let devuelve : Promise<any>;
          
        if(idAcciones.length){
            for(let indiceIdAcciones = 0; indiceIdAcciones < idAcciones.length; indiceIdAcciones++){
                devuelve = this.database.executeSql(
                    `DELETE FROM accion WHERE id = ${idAcciones[indiceIdAcciones]};`, [])
                .then(() => this.cambio.next(!this.cambio.value))
                .catch((err) => alert("Error borrando accion -> " + JSON.stringify(err)));
            }
        } else {
            alert("borraAcciones: No se han pasado acciones");
            devuelve = new Promise(() => {});
        }
        return devuelve;
    }

    public borraFilasDeAccion(id: number){
        return this.database.executeSql(
            `DELETE FROM fila WHERE accion = ${id};`, [])
            .then(() => {
                this.cambio.next(!this.cambio.value);
        })
        .catch((err) => alert("Error borrando filas -> " + JSON.stringify(err)));
        
    }

    public borraSugerenciasDeFila(fila: number, cantidad?: number){
        let filasQueBorrar = "";
        if(cantidad != undefined) filasQueBorrar = "id IN (SELECT id FROM sugerencia WHERE fila = " + fila + " ORDER BY fecha_ultimo_uso ASC LIMIT " + cantidad + ")";
        else filasQueBorrar = "fila = " + fila;

        return this.database.executeSql(
            `DELETE FROM sugerencia WHERE ${filasQueBorrar};`, [])
        .then(() => {
            this.cambio.next(!this.cambio.value);
        })
        .catch((err) => alert("Error borrando sugerencias -> " + JSON.stringify(err)));
    }

    private insertaAccionesBasicas(usuario: number){
        this.insertaAccion(usuario, TiposAcciones.tab1, "Alarma", "⏰", "").then((accion) => {
            this.insertaFila(accion.insertId, TiposFilas.fija, "pon una alarma");
            this.insertaFila(accion.insertId, TiposFilas.temporal, "").then((fila) => {
                this.insertaSugerencia(fila.insertId, "hoy");
                this.insertaSugerencia(fila.insertId, "mañana");
                this.insertaSugerencia(fila.insertId, "pasado mañana");
            });
            this.insertaFila(accion.insertId, TiposFilas.fija, "a las");
            this.insertaFila(accion.insertId, TiposFilas.temporal, "").then((fila) => {
                this.insertaSugerencia(fila.insertId, "8:00");
                this.insertaSugerencia(fila.insertId, "14:00");
                this.insertaSugerencia(fila.insertId, "22:00");
            });
        });

        this.insertaAccion(usuario, TiposAcciones.tab1, "El tiempo", "⛅", "").then((accion) => {
            this.insertaFila(accion.insertId, TiposFilas.fija, "¿qué tiempo hará");
            this.insertaFila(accion.insertId, TiposFilas.temporal, "").then((fila) => {
                this.insertaSugerencia(fila.insertId, "hoy");
                this.insertaSugerencia(fila.insertId, "mañana");
                this.insertaSugerencia(fila.insertId, "pasado mañana");
            });
            this.insertaFila(accion.insertId, TiposFilas.temporal, "").then((fila) => {
                this.insertaSugerencia(fila.insertId, "en Madrid");
                this.insertaSugerencia(fila.insertId, "en Alicante");
                this.insertaSugerencia(fila.insertId, "en Pontevedra");
            });
            this.insertaFila(accion.insertId, TiposFilas.fija, "?");
        });
    }

    private insertaAccionesAplicaciones(usuario: number){
        this.insertaAccion(usuario, TiposAcciones.tab2, "Spotify", "💚", "").then((accion) => {
            this.insertaFila(accion.insertId, TiposFilas.fija, "pon");
            this.insertaFila(accion.insertId, TiposFilas.temporal, "").then((fila) => {
                this.insertaSugerencia(fila.insertId, "Imagine");
                this.insertaSugerencia(fila.insertId, "Für Elise");
                this.insertaSugerencia(fila.insertId, "16 añitos");
            });
            this.insertaFila(accion.insertId, TiposFilas.fija, "de");
            this.insertaFila(accion.insertId, TiposFilas.temporal, "").then((fila) => {
                this.insertaSugerencia(fila.insertId, "John Lennon");
                this.insertaSugerencia(fila.insertId, "Beethoven");
                this.insertaSugerencia(fila.insertId, "Dani Martín");
            });
            this.insertaFila(accion.insertId, TiposFilas.fija, "en Spotify");
        });
    }
}