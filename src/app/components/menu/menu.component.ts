import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor() { }

  modoSimpleActivado = false;
  
  cambiaModoSimple(){
    this.modoSimpleActivado = !this.modoSimpleActivado;
  }

  STTActivado = false;
  
  cambiaSTT(){
    this.STTActivado = !this.STTActivado;
  }

  ngOnInit() {}

}
