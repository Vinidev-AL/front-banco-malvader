import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ModuloCompartilhadoModule } from '../../modulo-compartilhado.module';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ChamadaService } from '../../_services/chamada.service';
import { DadosParaEnvio } from './interfaces/usuario.interfaces';
import { takeUntil } from 'rxjs';
import { MensagemService } from '../../_services/mensagem.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tela-cadastro-usuario',
  imports: [ModuloCompartilhadoModule],
  templateUrl: './tela-cadastro-usuario.component.html',
  styleUrl: './tela-cadastro-usuario.component.scss'
})
export class TelaCadastroUsuarioComponent implements OnInit, AfterViewInit, OnDestroy{

  constructor(
    private fb: FormBuilder,
    private chamadaService: ChamadaService,
    private mensagemService: MensagemService,
    private router: Router
  ){}

  public forms!: FormGroup;
  
  ngOnInit(): void {
    this.forms = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      data_nascimento: ['', Validators.required],
      tipo_usuario: [''], // Opcional
      telefone: [''], // Opcional
      senha_hash: ['', [Validators.required, Validators.minLength(8)]],
      otp_ativo: [false] // Booleano com valor padrão
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    
  }

  async confirmarEnvio(){
      let dadosParaEnvio = {};
      dadosParaEnvio = await this.chamadaService.estabeleObjetoValoresFormulario(this.forms);

      this.chamadaService.chamadaPost('/usuario', dadosParaEnvio).pipe()
      .subscribe(res => {
          if(!res.erro){
            this.mensagemService.mensagemSucesso("Usuário cadastrado com sucesso", 1000)
            this.router.navigate(['/login']); 
          }
          console.log("Esse é o resultado: ", res)
      })
  }
}
