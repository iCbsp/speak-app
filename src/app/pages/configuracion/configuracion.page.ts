import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {

  constructor(private route: ActivatedRoute) { }

  prueba: any;

  hi(){
    this.route.params.subscribe(params => {
      //this.prueba = params;
      console.log(params['id']);
    });
  }
  

  ngOnInit() {
  }

}
