import { Component, Input, OnInit } from '@angular/core';
import { ChamadaService } from '../../../_services/chamada.service';
import { AuthService } from '../../../_services/auth.service';
import { DadosCompartilhados } from '../../../_services/dadosCompartilhados.service';
import { Router } from '@angular/router';

interface DadosRecebidos {
  id_conta_corrente?: string
  id_conta_poupanca?: string
  id_conta_investimento?: string
}

@Component({
  selector: 'app-card-conta',
  templateUrl: './card-conta.component.html',
  styleUrl: './card-conta.component.scss'
})
export class CardContaCorrenteComponent implements OnInit{

@Input() dadosRecebidos!: DadosRecebidos;
@Input() tipoConta!: string;
constructor(
  private chamadaService: ChamadaService,
  private authService: AuthService,
  private dadosCompartilhados: DadosCompartilhados,
  private router: Router
){}


ngOnInit(): void {

}

clicouNaConta() {
  if(this.tipoConta.toLocaleLowerCase() == 'corrente'){
    this.dadosCompartilhados.definirDados({id_conta_corrente: this.dadosRecebidos.id_conta_corrente})
    this.router.navigate(['/conta-corrente'])
  } else if(this.tipoConta.toLocaleLowerCase() == 'poupanca'){
     this.dadosCompartilhados.definirDados({id_conta_poupanca: this.dadosRecebidos.id_conta_poupanca})
  } else if(this.tipoConta.toLocaleLowerCase() == 'investimento'){
    this.dadosCompartilhados.definirDados({id_conta_investimento: this.dadosRecebidos.id_conta_investimento})
  }
}

}
