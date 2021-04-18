import { Component } from '@angular/core';

import { TiposAcciones } from 'src/app/enumerations';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(
  ){}

  tab : TiposAcciones = TiposAcciones.tab3;

  ngOnInit() {
  }

}
