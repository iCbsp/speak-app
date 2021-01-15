import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable()
export class DatabaseService {

    private database: SQLiteObject;
    public message = '';

    constructor(
        private plt:Platform, 
        private sqlite:SQLite
        ) {

        // Creacion de la base de datos
        if(!plt.is('desktop')) this.plt.ready().then(() => {
        // let connection = this.sqlite.create({
            let conexion = this.sqlite.create({
                name: 'database.db',
                location: 'default'
            });

            if(conexion) conexion.then((db: SQLiteObject) => {
                this.message = JSON.stringify(db);
                this.database = db;
                this.creaTabla();
            });
            else alert("Error en la base de datos");
        });
    }

    private creaTabla() {
        this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS tabla (
            name TEXT
        );`, [])
        .then(() => this.message = 'Tabla creada')
        .catch((err) => this.message = "Error creando la tabla -> " + JSON.stringify(err));
    }
        
    private inserta() {
        this.database.executeSql(
        `INSERT INTO list(name) VALUES ('BBBB');`, [])
        .then(() => this.message = 'OK')
        .catch((err) => this.message = "error detected INSERTING tables -> " + JSON.stringify(err));
    }

    private selecciona() {
        this.database.executeSql(
        `SELECT * FROM list;`, [])
        .then((data)=>{
            if(data.rows.length){
            this.message = data.rows.item(0).name;
            //alert(data.rows.item(0));
            alert("Hay " + data.rows.length + " resultados");
            } else alert("Vacío");
        })
        .catch((err) => this.message = "error detected SELECTING tables -> " + JSON.stringify(err));
    }

    private borra() {
        this.database.executeSql(
        `DROP TABLE IF EXISTS list;`, [])
        .then((data)=>{
            if(data.rows.length){
            this.message = data.rows.item(0).name;
            alert("Se han eliminado " + data.rows.length + " tablas");
            } else alert("Vacío");
        })
        .catch((err) => this.message = "error detected DELETING tables -> " + JSON.stringify(err));
    }

}