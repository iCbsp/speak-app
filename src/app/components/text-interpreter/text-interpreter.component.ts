import { Component, Input, OnInit } from '@angular/core';
import * as data from '../../../assets/json/aspirantes_ES.json'

@Component({
  selector: 'app-text-interpreter',
  templateUrl: './text-interpreter.component.html',
  styleUrls: ['./text-interpreter.component.scss'],
})
export class TextInterpreterComponent implements OnInit {

  textoATratar: string = "";
  aspirantes: Array<string> = [];

  @Input() set textoGetter(texto: string){
    this.textoATratar = texto;
    this.actualizaTextoResultado();
  };

  constructor() { }

  ngOnInit() {}

  actualizaTextoResultado(textoATratar?: string){
    if(textoATratar == undefined || textoATratar == "") textoATratar = this.textoATratar;
    
    if(!this.aspirantes.length) this.cargaAspirantes();
  }

  cargaAspirantes(){
    console.log("a");
    console.log(data);
  }

}
