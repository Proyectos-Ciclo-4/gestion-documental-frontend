import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewuniquedocumentComponent } from './viewuniquedocument.component';

describe('ViewuniquedocumentComponent', () => {
  let component: ViewuniquedocumentComponent;
  let fixture: ComponentFixture<ViewuniquedocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewuniquedocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewuniquedocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
