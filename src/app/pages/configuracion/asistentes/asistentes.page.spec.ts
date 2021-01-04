import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AsistentesPage } from './asistentes.page';

describe('AsistentesPage', () => {
  let component: AsistentesPage;
  let fixture: ComponentFixture<AsistentesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistentesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AsistentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
