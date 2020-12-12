import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrganizacionPage } from './organizacion.page';

describe('OrganizacionPage', () => {
  let component: OrganizacionPage;
  let fixture: ComponentFixture<OrganizacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
