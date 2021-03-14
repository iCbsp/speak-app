import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrearAccionPopoverPage } from './crear-accion-popover.page';

describe('CrearAccionPopoverPage', () => {
  let component: CrearAccionPopoverPage;
  let fixture: ComponentFixture<CrearAccionPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearAccionPopoverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearAccionPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
