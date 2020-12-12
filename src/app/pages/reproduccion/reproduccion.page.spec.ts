import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReproduccionPage } from './reproduccion.page';

describe('ReproduccionPage', () => {
  let component: ReproduccionPage;
  let fixture: ComponentFixture<ReproduccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReproduccionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReproduccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
