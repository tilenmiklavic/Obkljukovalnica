import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrazaComponent } from './straza.component';

describe('StrazaComponent', () => {
  let component: StrazaComponent;
  let fixture: ComponentFixture<StrazaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrazaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrazaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
