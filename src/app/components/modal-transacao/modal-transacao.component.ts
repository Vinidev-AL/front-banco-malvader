import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ChamadaService } from '../../_services/chamada.service'; // Ajuste o caminho conforme necessário
import { MensagemService } from '../../_services/mensagem.service';

// ENUM para o tipo de operação (Saque ou Depósito)
export enum TipoTransacao {
  deposito = 'deposito',
  saque = 'saque'
}

// NOVO ENUM para o tipo de conta
export enum TipoConta {
  poupanca = 'conta-poupanca',
  corrente = 'conta-corrente',
  investimento = 'conta-investimento'
}

@Component({
  selector: 'app-transacao-modal',
  standalone: true, // Marcado como standalone para gerenciar as próprias dependências
  imports: [
    CommonModule,         // Para diretivas como *ngIf
    ReactiveFormsModule   // Para trabalhar com formulários reativos
  ],
  templateUrl: './modal-transacao.component.html',
  styleUrls: ['./modal-transacao.component.scss']
})
export class TransacaoModalComponent implements OnInit {
  // ENTRADAS: Dados que o componente recebe do pai
  @Input() tipo!: TipoTransacao;
  @Input() tipoConta!: TipoConta; // NOVO: Define qual a rota base da API
  @Input() idConta!: string;      // ID da conta específica (poupança, corrente, etc.)

  // SAÍDAS: Eventos que o componente emite para o pai
  @Output() fechar = new EventEmitter<void>();
  @Output() transacaoConcluida = new EventEmitter<void>();

  transacaoForm!: FormGroup;
  isLoading = false;
  titulo = '';
  textoBotao = '';


  constructor(
    private fb: FormBuilder,
    private chamadaService: ChamadaService,
    private msgService: MensagemService // Ajuste o serviço de mensagens conforme necessário


  ) { }

  ngOnInit(): void {
    this.configurarComponente();
    this.inicializarFormulario();
  }

  private configurarComponente(): void {
    const isDeposito = this.tipo === TipoTransacao.deposito;
    this.titulo = isDeposito ? 'Realizar Depósito' : 'Realizar Saque';
    this.textoBotao = isDeposito ? 'Depositar' : 'Sacar';
  }

  private inicializarFormulario(): void {
    this.transacaoForm = this.fb.group({
      valor: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  onSubmit(): void {
    if (this.transacaoForm.invalid) {
      this.transacaoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { valor } = this.transacaoForm.value;

    // Constrói a URL dinamicamente com base no tipo de conta e tipo de transação
    const url = `/${this.tipoConta}/${this.idConta}/${this.tipo}`;
    const body = { valor };

  
    this.chamadaService.chamadaPatch(url, body).subscribe({
      next: (resposta: any) => {
        this.msgService.mensagemSucesso(resposta?.mensagem || 'Transação realizada com sucesso!', 2000);
        console.log(resposta?.mensagem || 'Transação realizada com sucesso!');
        this.transacaoConcluida.emit();
      },
      error: (err: any) => {
        console.error(err.error?.mensagem || 'Falha na operação. Tente novamente.');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.fechar.emit();
    }
  }
}