import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ModuloCompartilhadoModule } from '../../modulo-compartilhado.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChamadaService } from '../../_services/chamada.service';
import { MensagemService } from '../../_services/mensagem.service';
import { AuthService } from '../../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tela-login-usuario',
  imports: [ModuloCompartilhadoModule],
  templateUrl: './tela-login-usuario.component.html',
  styleUrl: './tela-login-usuario.component.scss'
})
export class TelaLoginUsuarioComponent implements OnInit, AfterViewInit, OnDestroy {
constructor(
    private fb: FormBuilder,
    private chamadaService: ChamadaService,
    private mensagemService: MensagemService,
    private authService: AuthService,
    private router: Router
  ){}

  public forms!: FormGroup;
  
  ngOnInit(): void {
    this.forms = this.fb.group({
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      tipo: ['']
    });
  }

  ngAfterViewInit(): void {
      // Mudanças de estado

      // Inicializo  o tipo de usuário com cliente já
      this.forms.get('tipo')?.setValue('cliente')
  }

  ngOnDestroy(): void {
    
  }

  async confirmarEnvio(){
      let dadosParaEnvio = {};
      dadosParaEnvio = await this.chamadaService.estabeleObjetoValoresFormulario(this.forms);

      this.chamadaService.chamadaPost('/auth/usuario/login', dadosParaEnvio).pipe()
      .subscribe(res => {
          if(!res.erro){
            this.mensagemService.mensagemSucesso("Login realizado com sucesso", 2000)
            this.authService.salvarToken(res.token)

            const informacoesUsuario = this.authService.decodificarJwt(localStorage.getItem('jwtToken') || '')
            console.log(informacoesUsuario);
            
            if(!!informacoesUsuario.otp_ativo){
              this.router.navigate(['/validar-otp']);  
            } else {
              if(informacoesUsuario.perfil == 'comum'){
                this.router.navigate(['/home-cliente'])
              };
            }

           
          }
      })
  }
}
