import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabPageComponent } from './components/tab-page/tab-page.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ExploreContainerComponentModule } from './explore-container/explore-container.module';

@NgModule({
  declarations: [ 
    // IonicModule,
    // CommonModule,
    // FormsModule,
    // ExploreContainerComponentModule,
    TabPageComponent
  ],
  imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      ExploreContainerComponentModule,
   ],
  exports:[ TabPageComponent ]
})
export class SharedModule { }