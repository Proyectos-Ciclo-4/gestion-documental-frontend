import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDocumentComponent } from './admin-document.component';

describe('ViewDocumentComponent', () => {
  let component: AdminDocumentComponent;
  let fixture: ComponentFixture<AdminDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDocumentComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
