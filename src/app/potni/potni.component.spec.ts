import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotniComponent } from './potni.component';

describe('PotniComponent', () => {
  let component: PotniComponent;
  let fixture: ComponentFixture<PotniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PotniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PotniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
