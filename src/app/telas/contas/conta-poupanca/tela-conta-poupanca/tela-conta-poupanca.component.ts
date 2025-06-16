import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModuloCompartilhadoModule } from '../../../../modulo-compartilhado.module';
import { HeaderComponent } from '../../../../components/header/header.component';
import { ChamadaService } from '../../../../_services/chamada.service';
import { DadosCompartilhados } from '../../../../_services/dadosCompartilhados.service';

interface InformacoesContaPoupanca {
    numero_conta: string;
    saldo: number;
    codigo_agencia: string;
    rendimento_mensal: number;
}

@Component({
  selector: 'app-tela-conta-poupanca',
  imports: [ModuloCompartilhadoModule, HeaderComponent],
  templateUrl: './tela-conta-poupanca.component.html',
  styleUrl: './tela-conta-poupanca.component.scss'
})
export class TelaContaPoupancaComponent implements OnInit, AfterViewInit {
  constructor(
    private chamadaService: ChamadaService,
    private dadosCompartilhados: DadosCompartilhados,
    private router: Router
  ) {}

  informacoesContaPoupanca!: InformacoesContaPoupanca;

  ngOnInit(): void {
    const dados = this.dadosCompartilhados.resgatarDados();
    this.chamadaService.chamadaGet(`/conta-poupanca/informacoes/${dados?.id_conta_poupanca}`).subscribe(res => {
      this.informacoesContaPoupanca = res;
    });
  }

  ngAfterViewInit(): void {}

  irParaTransferencia() {
    this.router.navigate(['conta-poupanca/tranferencia']);
  }
}
