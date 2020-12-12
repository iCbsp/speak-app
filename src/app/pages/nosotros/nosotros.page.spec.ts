import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NosotrosPage } from './nosotros.page';

describe('NosotrosPage', () => {
  let component: NosotrosPage;
  let fixture: ComponentFixture<NosotrosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NosotrosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NosotrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
