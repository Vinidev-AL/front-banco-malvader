import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms'; // Importe FormsModule e NgForm
import { ModuloCompartilhadoModule } from '../../modulo-compartilhado.module';
import { HeaderComponent } from '../../components/header/header.component';
import { TransacaoModalComponent } from '../../components/modal-transacao/modal-transacao.component';
import { DadosCompartilhados } from '../../_services/dadosCompartilhados.service';
import { ChamadaService } from '../../_services/chamada.service';
import { MensagemService } from '../../_services/mensagem.service';

// Reutilizando os enums já existentes para consistência
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

interface DadosEmprestimoSolicitado {
  id_conta: string;
  valor_solicitado: number;
  taxa_juros_mensal: number;
  prazo_meses: number;
}

@Component({
  selector: 'app-tela-solicitar-emprestimo',
  imports: [ModuloCompartilhadoModule, HeaderComponent, TransacaoModalComponent, FormsModule], // Adicione FormsModule
  templateUrl: './solicitar-emprestimo.component.html',
  styleUrl: './solicitar-emprestimo.component.scss'
})
export class TelaSolicitarEmprestimoComponent implements OnInit, AfterViewInit {
  constructor(
    private chamadaService: ChamadaService,
    private dadosCompartilhados: DadosCompartilhados,
    private router: Router,
    private mensagemService: MensagemService 
  ) {}

  tipoContaEnum = TipoConta;
  tipoTransacao: TipoTransacao = TipoTransacao.solicitarEmprestimo; // Define o tipo de transação como empréstimo
  isModalAberto = false;

  idDaConta: string = '';
  valorSolicitado: number | null = null;
  prazoMeses: number | null = null;
  taxaJurosMensal: number = 0.01; // Exemplo: 1% ao mês. Pode vir de uma API.

  ngOnInit(): void {
    const dados = this.dadosCompartilhados.resgatarDados();
    // Você pode pegar o id da conta corrente ou da poupança, dependendo da sua regra de negócio
    this.idDaConta = dados?.id_conta_corrente || dados?.id_conta_poupanca || '';

  }

  ngAfterViewInit(): void {}

  solicitarEmprestimo(): void {
    if (this.valorSolicitado === null || this.prazoMeses === null || !this.idDaConta) {
      console.error('Dados de empréstimo incompletos.');
      // Adicione aqui feedback visual para o usuário, se desejar
      return;
    }

    const dadosEmprestimo: DadosEmprestimoSolicitado = {
      id_conta: this.idDaConta,
      valor_solicitado: this.valorSolicitado,
      taxa_juros_mensal: this.taxaJurosMensal,
      prazo_meses: this.prazoMeses
    };

    this.chamadaService.chamadaPost('/emprestimo', dadosEmprestimo).subscribe(
      (res) => {
        console.log('Empréstimo solicitado com sucesso:', res);
        this.mensagemService.mensagemSucesso('Empréstimo solicitado com sucesso!', 2000);
       
        this.isModalAberto = true; 
      },
      (error) => {
        console.error('Erro ao solicitar empréstimo:', error);
      }
    );
  }

  fecharModal(): void {
    this.isModalAberto = false;
 
    this.router.navigate(['/dashboard']);
  }
}