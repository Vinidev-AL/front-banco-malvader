import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaInvestimentoComponent } from './conta-investimento.component';

describe('ContaInvestimentoComponent', () => {
  let component: ContaInvestimentoComponent;
  let fixture: ComponentFixture<ContaInvestimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContaInvestimentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContaInvestimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
