import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeDocsComponent } from './type-docs.component';

describe('TypeDocsComponent', () => {
  let component: TypeDocsComponent;
  let fixture: ComponentFixture<TypeDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeDocsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
