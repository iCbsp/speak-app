import { Component } from '@angular/core';

import { TiposAcciones } from 'src/app/enumerations';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
  ){}

  tab : TiposAcciones = TiposAcciones.tab1;

  ngOnInit() {
  }

}
