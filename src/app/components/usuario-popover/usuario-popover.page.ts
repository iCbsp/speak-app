import { Component, OnInit } from '@angular/core';

// Popover
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-usuario-popover',
  templateUrl: './usuario-popover.page.html',
  styleUrls: ['./usuario-popover.page.scss'],
})
export class UsuarioPopoverPage implements OnInit {

  constructor(
    private popover:PopoverController
  ) { }

  ngOnInit() {
  }

  closePopover(){
    this.popover.dismiss();
  }

}
