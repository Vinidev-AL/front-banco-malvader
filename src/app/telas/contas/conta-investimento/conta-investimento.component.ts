import { Component } from '@angular/core';
import { AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuloCompartilhadoModule } from '../../../modulo-compartilhado.module';
import { HeaderComponent } from '../../../components/header/header.component';
import { TransacaoModalComponent } from '../../../components/modal-transacao/modal-transacao.component';
import { ChamadaService } from '../../../_services/chamada.service';
import { DadosCompartilhados } from '../../../_services/dadosCompartilhados.service';


interface InformacoesContaInvestimento {
  numero_conta: string;
  saldo: number;
  codigo_agencia: string;
  taxa_rendimento_base: number;
  data_aplicacao: string;
}

export enum TipoTransacao {
  deposito = 'deposito', 
  saque = 'saque'
}

export enum TipoConta {
  poupanca = 'conta-poupanca',
  corrente = 'conta-corrente',
  investimento = 'conta-investimento'
}


@Component({
  selector: 'app-conta-investimento',
  imports:[ModuloCompartilhadoModule, HeaderComponent, TransacaoModalComponent],
  templateUrl: './conta-investimento.component.html',
  styleUrl: './conta-investimento.component.scss'
})
export class ContaInvestimentoComponent {

  constructor(
    private chamadaService: ChamadaService,
    private dadosCompartilhados: DadosCompartilhados,
    private router: Router
  ) {}

  tipoContaEnum = TipoConta;
  idDaContaInvestimento: string = '';

  informacoesContaInvestimento!: InformacoesContaInvestimento;

  ngOnInit(): void {
    this.carregarInformacoesContaInvestimento();
  }

  carregarInformacoesContaInvestimento(): void {
    const dados = this.dadosCompartilhados.resgatarDados();
    this.idDaContaInvestimento = dados?.id_conta_investimento || ''; 
    this.chamadaService.chamadaGet(`/conta-investimento/informacoes/${this.idDaContaInvestimento}`).subscribe(res => {
      this.informacoesContaInvestimento = res;
    });
  }

  ngAfterViewInit(): void {}

  isModalAberto = false;
  tipoTransacao: TipoTransacao = TipoTransacao.deposito; // Tipo padrão para investimento

  sacar(): void {
    this.isModalAberto = true;
    this.tipoTransacao = TipoTransacao.saque;
  }

  depositar(): void {
    this.isModalAberto = true;
    this.tipoTransacao = TipoTransacao.deposito;
  }

  fecharModal(): void {
    this.carregarInformacoesContaInvestimento();
    this.isModalAberto = false;
  }
}












