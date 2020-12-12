import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccesibilidadPage } from './accesibilidad.page';

describe('AccesibilidadPage', () => {
  let component: AccesibilidadPage;
  let fixture: ComponentFixture<AccesibilidadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccesibilidadPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccesibilidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
