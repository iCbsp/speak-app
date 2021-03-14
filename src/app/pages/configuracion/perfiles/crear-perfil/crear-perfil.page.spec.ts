import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrearPerfilPage } from './crear-perfil.page';

describe('CrearPerfilPage', () => {
  let component: CrearPerfilPage;
  let fixture: ComponentFixture<CrearPerfilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearPerfilPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
