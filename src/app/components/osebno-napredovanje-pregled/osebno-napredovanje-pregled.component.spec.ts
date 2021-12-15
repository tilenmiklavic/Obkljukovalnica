import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsebnoNapredovanjePregledComponent } from './osebno-napredovanje-pregled.component';

describe('OsebnoNapredovanjePregledComponent', () => {
  let component: OsebnoNapredovanjePregledComponent;
  let fixture: ComponentFixture<OsebnoNapredovanjePregledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OsebnoNapredovanjePregledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OsebnoNapredovanjePregledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
