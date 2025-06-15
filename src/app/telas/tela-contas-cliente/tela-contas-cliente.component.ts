import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CardContaCorrenteComponent } from './card-conta/card-conta.component';
import { ChamadaService } from '../../_services/chamada.service';
import { timer } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { ModuloCompartilhadoModule } from '../../modulo-compartilhado.module';
import { DadosCompartilhados } from '../../_services/dadosCompartilhados.service';

interface ObjetoContaCorrente {
  id_conta_corrente: string
}

interface ObjetoContaPoupanca {
  id_conta_poupanca: string
}

interface ObjetoContaInvestimento {
  id_conta_investimento: string
}

@Component({
  selector: 'app-tela-contas-cliente',
  imports: [ModuloCompartilhadoModule ,HeaderComponent, CardContaCorrenteComponent],
  templateUrl: './tela-contas-cliente.component.html',
  styleUrl: './tela-contas-cliente.component.scss'
})
export class TelaContasClienteComponent implements OnInit, AfterViewInit {

  constructor(
    private chamadaService: ChamadaService,
    private authService: AuthService,
    private dadosCompartilhados: DadosCompartilhados
  ) {}

  public contasCorrente: ObjetoContaCorrente[] = [];
  public contasPoupanca: ObjetoContaPoupanca[] = [];
  public contasInvestimento: ObjetoContaInvestimento[] = [];

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

    const informacoesUsuario = this.authService.decodificarJwt(localStorage.getItem('jwtToken') || '')
  
    // Carregar conta corrente
    this.chamadaService.chamadaGet(`/conta-corrente/${informacoesUsuario.cpf}`).subscribe(res => {
    
      if(!!res){

        this.contasCorrente.push(res);
      }
    })

    // Carregar conta poupança
    this.chamadaService.chamadaGet(`/conta-poupanca/${informacoesUsuario.cpf}`).subscribe(res => {
      console.log("Esse é o resultado da conta poupança: ", res)
      if(res.length > 0){
        this.contasPoupanca.push(res);
      }
    })

    // Carregar conta investimento
    this.chamadaService.chamadaGet(`/conta-investimento/${informacoesUsuario.cpf}`).subscribe(res => {
      if(res.length > 0){
        this.contasInvestimento.push(res);
      }
    })


  }
}
