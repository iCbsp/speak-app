import { Component } from '@angular/core';
import { TiposAcciones } from 'src/enumerations';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  
  constructor() {}

  tab : TiposAcciones = TiposAcciones.tab1;

  ngOnInit() {
  }

}
