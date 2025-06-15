import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModuloCompartilhadoModule } from '../../../../modulo-compartilhado.module';
import { HeaderComponent } from '../../../../components/header/header.component';
import { ChamadaService } from '../../../../_services/chamada.service';
import { DadosCompartilhados } from '../../../../_services/dadosCompartilhados.service';
import { Router } from '@angular/router';

interface InformacoesContaCorrente {
    numero_conta: string,
    saldo: number,
    limite: number,
    codigo_agencia: string
}

@Component({
  selector: 'app-tela-conta-corrente',
  imports: [ModuloCompartilhadoModule, HeaderComponent],
  templateUrl: './tela-conta-corrente.component.html',
  styleUrl: './tela-conta-corrente.component.scss'
})
export class TelaContaCorrenteComponent implements OnInit, AfterViewInit {
  constructor(
    private chamadaService: ChamadaService,
    private dadosCompartilhados: DadosCompartilhados,
    private router: Router
  ){}

  informacoesContaCorrente!: InformacoesContaCorrente;

  ngOnInit(): void {
      const informacoesDadosCompartilhados = this.dadosCompartilhados.resgatarDados()
      console.log(informacoesDadosCompartilhados);
      
      this.chamadaService.chamadaGet(`/conta-corrente/informacoes/${informacoesDadosCompartilhados?.id_conta_corrente}`).subscribe(res => {
        this.informacoesContaCorrente = res
      })
  }

  ngAfterViewInit(): void {
    
  }

  irParaTransferencia() {
    // Lógica para ir para a tela de transferência
    this.router.navigate(['conta-corrente/tranferencia']);
  }
}
