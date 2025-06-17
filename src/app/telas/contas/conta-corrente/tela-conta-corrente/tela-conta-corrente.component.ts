import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModuloCompartilhadoModule } from '../../../../modulo-compartilhado.module';
import { HeaderComponent } from '../../../../components/header/header.component';
import { ChamadaService } from '../../../../_services/chamada.service';
import { DadosCompartilhados } from '../../../../_services/dadosCompartilhados.service';
import { Router } from '@angular/router';
import { TransacaoModalComponent } from '../../../../components/modal-transacao/modal-transacao.component';


interface InformacoesContaCorrente {
    numero_conta: string,
    saldo: number,
    limite: number,
    codigo_agencia: string
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
  selector: 'app-tela-conta-corrente',
  imports: [ModuloCompartilhadoModule, HeaderComponent, TransacaoModalComponent],
  templateUrl: './tela-conta-corrente.component.html',
  styleUrl: './tela-conta-corrente.component.scss'
})
export class TelaContaCorrenteComponent implements OnInit, AfterViewInit {
  constructor(
    private chamadaService: ChamadaService,
    private dadosCompartilhados: DadosCompartilhados,
    private router: Router
  ){}

  tipoContaEnum = TipoConta;
  idDaContaCorrente: string = '';

  informacoesContaCorrente!: InformacoesContaCorrente;

  ngOnInit(): void {
      this.carregarInformacoesContaCorrente();
  }

  carregarInformacoesContaCorrente(): void {
    const dados = this.dadosCompartilhados.resgatarDados();
    this.idDaContaCorrente = dados?.id_conta_corrente || '';
    this.chamadaService.chamadaGet(`/conta-corrente/informacoes/${this.idDaContaCorrente}`).subscribe(res => {
      this.informacoesContaCorrente = res;
    });
  }

  ngAfterViewInit(): void {
    
  }

  irParaTransferencia() {
    // Lógica para ir para a tela de transferência
    this.router.navigate(['conta-corrente/tranferencia']);
  }

  sacar(): void {
    this.isModalAberto = true;
    this.tipoTransacao = TipoTransacao.saque;
  }
  depositar(): void {
    this.isModalAberto = true;
    this.tipoTransacao = TipoTransacao.deposito;
  }

  isModalAberto = false;
  tipoTransacao: TipoTransacao = TipoTransacao.deposito;
  fecharModal(): void {
    this.isModalAberto = false;
    this.carregarInformacoesContaCorrente();
  }
}
