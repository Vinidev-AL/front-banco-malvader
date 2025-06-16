import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuloCompartilhadoModule } from '../../../../modulo-compartilhado.module';
import { HeaderComponent } from '../../../../components/header/header.component';
import { ChamadaService } from '../../../../_services/chamada.service';
import { DadosCompartilhados } from '../../../../_services/dadosCompartilhados.service';
import { TransacaoModalComponent } from '../../../../components/modal-transacao/modal-transacao.component';

interface InformacoesContaPoupanca {
    numero_conta: string;
    saldo: number;
    codigo_agencia: string;
    rendimento_mensal: number;
    taxa_rendimento: number;
}

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
  selector: 'app-tela-conta-poupanca',
  imports: [ModuloCompartilhadoModule, HeaderComponent, TransacaoModalComponent],
  templateUrl: './tela-conta-poupanca.component.html',
  styleUrl: './tela-conta-poupanca.component.scss'
})

export class TelaContaPoupancaComponent implements OnInit, AfterViewInit {
  constructor(
    private chamadaService: ChamadaService,
    private dadosCompartilhados: DadosCompartilhados,
    private router: Router
  ) {}

  tipoContaEnum = TipoConta;
  idDaContaPoupanca: string = '';

  informacoesContaPoupanca!: InformacoesContaPoupanca;

  ngOnInit(): void {
    this.carregarInformacoesContaPoupanca();
  }

  carregarInformacoesContaPoupanca(): void {
    const dados = this.dadosCompartilhados.resgatarDados();
    this.idDaContaPoupanca = dados?.id_conta_poupanca || '';
    this.chamadaService.chamadaGet(`/conta-poupanca/informacoes/${this.idDaContaPoupanca}`).subscribe(res => {
      this.informacoesContaPoupanca = res;
    });
  }

  ngAfterViewInit(): void {}

  isModalAberto = false;
  tipoTransacao: TipoTransacao = TipoTransacao.deposito;
  sacar(): void {
    this.isModalAberto = true;
    this.tipoTransacao = TipoTransacao.saque;
  }

  depositar(): void {
    this.isModalAberto = true;
    this.tipoTransacao = TipoTransacao.deposito;
  }

  fecharModal(): void {
    this.carregarInformacoesContaPoupanca();
    this.isModalAberto = false;
  }

}
