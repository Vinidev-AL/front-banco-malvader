import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ChamadaService } from '../../_services/chamada.service'; // Ajuste o caminho conforme necessário
import { MensagemService } from '../../_services/mensagem.service';


export enum TipoTransacao {
  deposito = 'deposito',
  saque = 'saque',
  solicitarEmprestimo = 'solicitar'
}


export enum TipoConta {
  poupanca = 'conta-poupanca',
  corrente = 'conta-corrente',
  investimento = 'conta-investimento',
  emprestimo = 'emprestimo' 
}

@Component({
  selector: 'app-transacao-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './modal-transacao.component.html',
  styleUrls: ['./modal-transacao.component.scss']
})
export class TransacaoModalComponent implements OnInit {
 
  public TipoTransacao = TipoTransacao; 

 
  @Input() tipo!: TipoTransacao;
  @Input() tipoConta!: TipoConta;
  @Input() idConta!: string;
  @Input() valorTransacao: number | null = null; 
  @Input() prazoMeses: number | null = null;
  @Input() taxaJurosMensal: number | null = null; 


  @Output() fechar = new EventEmitter<void>();
  @Output() transacaoConcluida = new EventEmitter<void>();

  transacaoForm!: FormGroup;
  isLoading = false;
  titulo = '';
  textoBotao = '';

  constructor(
    private fb: FormBuilder,
    private chamadaService: ChamadaService,
    private msgService: MensagemService
  ) { }

  ngOnInit(): void {
    this.configurarComponente();
    this.inicializarFormulario();
  }

  private configurarComponente(): void {
    switch (this.tipo) {
      case TipoTransacao.deposito:
        this.titulo = 'Realizar Depósito';
        this.textoBotao = 'Depositar';
        break;
      case TipoTransacao.saque:
        this.titulo = 'Realizar Saque';
        this.textoBotao = 'Sacar';
        break;
      case TipoTransacao.solicitarEmprestimo:
        this.titulo = 'Confirmação de Empréstimo';
        this.textoBotao = 'Confirmar Solicitação';
        break;
      default:
        this.titulo = 'Transação';
        this.textoBotao = 'Confirmar';
    }
  }

  private inicializarFormulario(): void {
    const valorInicial = this.tipo === TipoTransacao.solicitarEmprestimo ? this.valorTransacao : null;

    this.transacaoForm = this.fb.group({
      valor: [{ value: valorInicial, disabled: this.tipo === TipoTransacao.solicitarEmprestimo }, [Validators.required, Validators.min(0.01)]]
    });


    if (this.tipo === TipoTransacao.solicitarEmprestimo) {
      this.transacaoForm.addControl('prazo', this.fb.control({ value: this.prazoMeses, disabled: true }));
      this.transacaoForm.addControl('taxa', this.fb.control({ value: this.taxaJurosMensal, disabled: true }));
    }
  }

  onSubmit(): void {
   
    if (this.tipo !== TipoTransacao.solicitarEmprestimo && this.transacaoForm.invalid) {
      this.transacaoForm.markAllAsTouched();
      return;
    }


    if (this.tipo === TipoTransacao.solicitarEmprestimo && (this.valorTransacao === null || this.prazoMeses === null || this.taxaJurosMensal === null || !this.idConta)) {
      console.error('Dados de empréstimo incompletos para submissão do modal.');
      this.msgService.mensagemErro('Dados incompletos para solicitar o empréstimo.', 3000);
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    const valor = this.tipo === TipoTransacao.solicitarEmprestimo ? this.valorTransacao : this.transacaoForm.get('valor')?.value;

    let url: string;
    let body: any;
    let method: 'patch' | 'post'; 

    if (this.tipo === TipoTransacao.solicitarEmprestimo) {
      url = '/emprestimo'; 
      body = {
        id_conta: this.idConta,
        valor_solicitado: valor,
        prazo_meses: this.prazoMeses,
        taxa_juros_mensal: this.taxaJurosMensal
      };
      method = 'post';
    } else {
  
      url = `/${this.tipoConta}/${this.idConta}/${this.tipo}`;
      body = { valor };
      method = 'patch';
    }

    const request = method === 'post' ? this.chamadaService.chamadaPost(url, body) : this.chamadaService.chamadaPatch(url, body);

    request.subscribe({
      next: (resposta: any) => {
        this.msgService.mensagemSucesso(resposta?.mensagem || (this.tipo === TipoTransacao.solicitarEmprestimo ? 'Empréstimo solicitado com sucesso!' : 'Transação realizada com sucesso!'), 2000);
        console.log(resposta?.mensagem || (this.tipo === TipoTransacao.solicitarEmprestimo ? 'Empréstimo solicitado com sucesso!' : 'Transação realizada com sucesso!'));
        this.transacaoConcluida.emit();
      },
      error: (err: any) => {
        console.error(err.error?.mensagem || 'Falha na operação. Tente novamente.');
        this.msgService.mensagemErro(err.error?.mensagem || 'Falha na operação. Tente novamente.', 3000);
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