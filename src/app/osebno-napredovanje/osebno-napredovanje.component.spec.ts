import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsebnoNapredovanjeComponent } from './osebno-napredovanje.component';

describe('OsebnoNapredovanjeComponent', () => {
  let component: OsebnoNapredovanjeComponent;
  let fixture: ComponentFixture<OsebnoNapredovanjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OsebnoNapredovanjeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OsebnoNapredovanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
