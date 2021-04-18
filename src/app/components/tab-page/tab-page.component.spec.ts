import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabPageComponent } from './tab-page.component';

describe('TabPageComponent', () => {
  let component: TabPageComponent;
  let fixture: ComponentFixture<TabPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabPageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
