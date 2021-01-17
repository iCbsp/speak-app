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
        private plt:Platform, 
        private sqlite:SQLite
        ) {

        // Creacion de la base de datos
        if(!plt.is('desktop')) this.plt.ready().then(() => {
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
            color TEXT
        );`, [])
        .then(() => this.messages.push("Tabla de usuario creada"))
        .catch((err) => alert("Error creando la tabla -> " + JSON.stringify(err)));

        // Configuracion
        this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS configuracion (
            id INTEGER primary key,
            usuario INTEGER,
            modo_simple INTEGER,
            respuesta INTEGER,
            FOREIGN KEY(usuario) REFERENCES usuario(id)
        );`, [])
        .then(() => this.messages.push("Tabla de configuracion creada"))
        .catch((err) => alert("Error creando la tabla -> " + JSON.stringify(err)));
    }
        
    private insercionesIniciales() {
        // Igual esto deberia de ser una transaccion (??????)

        // Usuario
        this.database.executeSql(
        `INSERT INTO usuario(nombre, color) VALUES ('usuario', '#000000');`, [])
        .then((usuario) => {
            alert("Usuario creado: " + usuario.insertId);
            this.usuarioActual = usuario.insertId;
            if(usuario.insertId){
                // Configuracion
                this.database.executeSql(
                `INSERT INTO configuracion(usuario, modo_simple, respuesta) VALUES (${usuario.insertId}, 0, 0);`, [])
                .then(() => {})
                .catch((err) => alert("Error insertando configuracion -> " + JSON.stringify(err)));
            }
        })
        .catch((err) => alert("Error insertando usuario -> " + JSON.stringify(err)));

        // Usuario2
        this.database.executeSql(
        `INSERT INTO usuario(nombre, color) VALUES ('usuario2', '#000000');`, [])
        .then((usuario) => {
            alert("Usuario creado: " + usuario.insertId);
            // this.usuarioActual = usuario.insertId;
            if(usuario.insertId){
                // Configuracion2
                this.database.executeSql(
                `INSERT INTO configuracion(usuario, modo_simple, respuesta) VALUES (${usuario.insertId}, 1, 1);`, [])
                .then(() => this.lista.next(true))
                .catch((err) => alert("Error insertando configuracion -> " + JSON.stringify(err)));
            }
        })
        .catch((err) => alert("Error insertando usuario -> " + JSON.stringify(err)));

    }

    private comprobacionDatos(){
        this.database.executeSql(
        `SELECT * FROM usuario;`, [])
        .then((data)=>{
            if(!data.rows.length){
                alert("Base de datos vacía, insertando datos iniciales");
                this.insercionesIniciales();
            } else {
                alert("Hay base de datos, iniciada la sesion del usuario " + data.rows.item(0).id);
                this.usuarioActual = data.rows.item(0).id;
                this.lista.next(true);
            }
            alert("idUsuario: " + this.usuarioActual);
        })
        .catch((err) => {
            alert("Error contando usuarios -> " + JSON.stringify(err));
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
            // alert("configuraciones.rows.length: " + configuraciones.rows.length);
            if(configuraciones.rows.length){
                // for (let i = 0; i < configuraciones.rows.length; i++) 
                //     if(i == 1) 
                //         configuraciones.rows.item(i);
                configuracion = configuraciones.rows.item(0);
            } else alert("obtenConfiguracion: No hay configuracion");
        })
        .catch((err) => {
            alert("Error obteniendo la configuracion -> " + JSON.stringify(err));
        });
        return configuracion;
    }

    public async obtenUsuarios(){
        let listaUsuarios: any;
        await this.database.executeSql(`SELECT * FROM usuario`, []).then((usuarios)=>{
            if(usuarios.rows.length){
                listaUsuarios = usuarios.rows;
            } else alert("obtenUsuarios: No hay usuarios");
        })
        .catch((err) => {
            alert("Error obteniendo los usuarios -> " + JSON.stringify(err));
        });
        return listaUsuarios;
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