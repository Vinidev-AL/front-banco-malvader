import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaValidarOtpComponent } from './tela-validar-otp.component';

describe('TelaValidarOtpComponent', () => {
  let component: TelaValidarOtpComponent;
  let fixture: ComponentFixture<TelaValidarOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaValidarOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaValidarOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
