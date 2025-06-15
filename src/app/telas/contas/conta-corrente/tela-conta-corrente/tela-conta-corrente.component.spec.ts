import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaContaCorrenteComponent } from './tela-conta-corrente.component';

describe('TelaContaCorrenteComponent', () => {
  let component: TelaContaCorrenteComponent;
  let fixture: ComponentFixture<TelaContaCorrenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaContaCorrenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaContaCorrenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
