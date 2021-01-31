import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccionPopoverPage } from './accion-popover.page';

describe('AccionPopoverPage', () => {
  let component: AccionPopoverPage;
  let fixture: ComponentFixture<AccionPopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccionPopoverPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccionPopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
