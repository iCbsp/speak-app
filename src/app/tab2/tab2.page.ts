import { Component } from '@angular/core';

import { TiposAcciones } from 'src/app/enumerations';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
  ){}

  tab : TiposAcciones = TiposAcciones.tab2;

  ngOnInit() {
  }

}
