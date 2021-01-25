import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DatabaseService {

    private database: SQLiteObject;
    public messages = [];
    public lista = new BehaviorSubject<boolean>(false);
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
        // Usuario
        this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS usuario (
            id INTEGER primary key,
            nombre TEXT,
            color TEXT,
            fecha_ultimo_inicio TEXT
        );`, [])
        .then(() => this.messages.push("Tabla de usuario creada"))
        .catch((err) => alert("Error creando la tabla -> " + JSON.stringify(err)));

        // Configuracion
        this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS configuracion (
            id INTEGER primary key,
            usuario INTEGER,
            asistente INTEGER,
            modo_simple INTEGER,
            respuesta INTEGER,
            FOREIGN KEY(usuario) REFERENCES usuario(id),
            FOREIGN KEY(asistente) REFERENCES asistente(id)
        );`, [])
        .then(() => this.messages.push("Tabla de configuracion creada"))
        .catch((err) => alert("Error creando la tabla -> " + JSON.stringify(err)));
        
        // Asistente
        this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS asistente (
            id INTEGER primary key,
            inicial TEXT,
            final TEXT
        );`, [])
        .then(() => this.messages.push("Tabla de asistente creada"))
        .catch((err) => alert("Error creando la tabla -> " + JSON.stringify(err)));
    }
        
    private insercionesIniciales() {
        // Igual esto deberia de ser una transaccion (??????)

        this.insertaAsistente("Alexa", "");
        this.insertaAsistente("Ok Google", "");
        this.insertaAsistente("Siri", "");

        this.publicaUsuario("Usuario", "#32a852").then(() => this.lista.next(true));
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
            else alert("obtenAsistentes: No hay asistentes");
        })
        .catch((err) => alert("Error obteniendo los asistentes -> " + JSON.stringify(err)));
        return listaAsistentes;
    }
    
    public async obtenUsuario(usuarioID : number){
        let usuario: any;
        await this.database.executeSql(`SELECT * FROM usuario WHERE id = ${usuarioID}`, []).then((usuarios)=>{
            if(usuarios.rows.length) usuario = usuarios.rows.item(0);
            else alert("obtenUsuario: No existe ese usuario");
        })
        .catch((err) => alert("Error en obtenUsuario -> " + JSON.stringify(err)));
        return usuario;
    }

    public async obtenAsistenteDeUsuario(usuarioID : number){
        let asistente: any;
        await this.database.executeSql(`SELECT asistente.id FROM asistente, configuracion WHERE configuracion.asistente = asistente.id AND configuracion.usuario = ${usuarioID};`, []).then((asistentes)=>{
            if(asistentes.rows.length) asistente = asistentes.rows.item(0);
            // else alert("obtenAsistente: No existe ese asistente");
        })
        .catch((err) => alert("Error en obtenAsistente -> " + JSON.stringify(err)));
        return asistente;
    }
    
    public cambiaModoSimple(modoSimpleBool: boolean){
        let modoSimpleInt = 0;
        if(modoSimpleBool) modoSimpleInt = 1;
        this.database.executeSql(
            `UPDATE configuracion SET modo_simple = ${modoSimpleInt} WHERE usuario = ${this.usuarioActual} `, [])
        .then(()=>{})
        .catch((err) => {
            alert("Error actualizando modo_simple -> " + JSON.stringify(err));
        });
    }

    public cambiaRespuesta(respuestaBool: boolean){
        let respuestaInt = 0;
        if(respuestaBool) respuestaInt = 1;
        this.database.executeSql(
            `UPDATE configuracion SET respuesta = ${respuestaInt} WHERE usuario = ${this.usuarioActual} `, [])
        .then(()=>{})
        .catch((err) => {
            alert("Error actualizando respuesta -> " + JSON.stringify(err));
        });
    }

    public cambiaUsuarioActual(nuevoUsuario : number){
        // Se deberian de hacer comprobaciones antes?
        this.usuarioActual = nuevoUsuario;
        this.database.executeSql(
            `UPDATE usuario SET fecha_ultimo_inicio = datetime('now') WHERE id = ${this.usuarioActual} `, [])
        .then(()=>{})
        .catch((err) => {
            alert("Error actualizando usuario -> " + JSON.stringify(err));
        });
    }

    public publicaUsuario(nombre : string, color : string) : any{
        return this.insertaUsuario(nombre, color).then((usuario) => {
            return this.insertaConfiguracion(usuario.insertId);
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
        if(usuario){
            return this.database.executeSql(
                `INSERT INTO configuracion(usuario, asistente, modo_simple, respuesta) VALUES (${usuario}, 0, 0, 0);`, [])
                .catch((err) => alert("Error insertando configuracion -> " + JSON.stringify(err)));
        } else alert("insertaConfiguracion: Usuario no valido");
    }
    
    private insertaAsistente(inicial : string, final : string){
        // if(inicial && final){
            return this.database.executeSql(
                `INSERT INTO asistente(inicial, final) VALUES ('${inicial}', '${final}');`, [])
                .catch((err) => alert("Error insertando asistente -> " + JSON.stringify(err)));
        // } else alert("insertaAsistente: Texto no valido");
    }

    public editaUsuario(usuario : number, nombre : string, color : string){
        if(usuario && nombre && color){
            return this.database.executeSql(
                `UPDATE usuario SET nombre = '${nombre}', color = '${color}' WHERE id = ${usuario}`, [])
                .catch((err) => alert("Error actualizando usuario -> " + JSON.stringify(err)));
        } else alert("editaUsuario: Usuario, nombre o color no válidos");
    }

    public borraUsuario(usuario : number){
        if(usuario){
            return this.database.executeSql(
                `DELETE FROM configuracion WHERE usuario = ${usuario}`, [])
                .then(() => {
                    return this.database.executeSql(
                        `DELETE FROM usuario WHERE id = ${usuario}`, [])
                        .then(() => {
                            this.obtenUsuariosSesion().then(usuariosBDD => {
                                this.usuarioActual = usuariosBDD.rows.item(0).id;
                            });
                        })
                        .catch((err) => alert("Error borrando usuario -> " + JSON.stringify(err)));
                })
                .catch((err) => alert("Error borrando configuracion -> " + JSON.stringify(err)));
        } else alert("insertaConfiguracion: Usuario no valido");
    }

    private borraTablas() {
        // Usuario
        this.database.executeSql(
        `DROP TABLE IF EXISTS usuario;`, [])
        .then((data)=>{
            this.messages.push("Se han eliminado " + data.rows.length + " tablas");
        })
        .catch((err) => alert("Error borrando tabla usuario -> " + JSON.stringify(err)));
        
        // Configuracion
        this.database.executeSql(
        `DROP TABLE IF EXISTS usuario;`, [])
        .then((data)=>{
            this.messages.push("Se han eliminado " + data.rows.length + " tablas");
        })
        .catch((err) => alert("Error borrando tabla usuario -> " + JSON.stringify(err)));
    }
}