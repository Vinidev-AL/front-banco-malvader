import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaCorrenteTransferenciaComponent } from './conta-corrente-transferencia.component';

describe('ContaCorrenteTransferenciaComponent', () => {
  let component: ContaCorrenteTransferenciaComponent;
  let fixture: ComponentFixture<ContaCorrenteTransferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContaCorrenteTransferenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContaCorrenteTransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
