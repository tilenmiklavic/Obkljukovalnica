import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrazaPregledComponent } from './straza-pregled.component';

describe('StrazaPregledComponent', () => {
  let component: StrazaPregledComponent;
  let fixture: ComponentFixture<StrazaPregledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrazaPregledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrazaPregledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
