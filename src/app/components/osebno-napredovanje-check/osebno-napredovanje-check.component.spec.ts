import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsebnoNapredovanjeCheckComponent } from './osebno-napredovanje-check.component';

describe('OsebnoNapredovanjeCheckComponent', () => {
  let component: OsebnoNapredovanjeCheckComponent;
  let fixture: ComponentFixture<OsebnoNapredovanjeCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OsebnoNapredovanjeCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OsebnoNapredovanjeCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
