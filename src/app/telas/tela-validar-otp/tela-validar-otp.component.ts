import { Component } from '@angular/core';
import { ModuloCompartilhadoModule } from '../../modulo-compartilhado.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChamadaService } from '../../_services/chamada.service';
import { MensagemService } from '../../_services/mensagem.service';
import { AuthService } from '../../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tela-validar-otp',
  imports: [ModuloCompartilhadoModule],
  templateUrl: './tela-validar-otp.component.html',
  styleUrl: './tela-validar-otp.component.scss'
})
export class TelaValidarOtpComponent {
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
      otp_codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    
  }

  async confirmarEnvio(){
      let dadosParaEnvio = {};
      dadosParaEnvio = await this.chamadaService.estabeleObjetoValoresFormulario(this.forms);

      this.chamadaService.chamadaPost('/auth/usuario/validar-otp', dadosParaEnvio).pipe()
      .subscribe(res => {
          if(!res.erro){
            this.mensagemService.mensagemSucesso("OTP validado com sucesso", 2000)
            this.authService.salvarToken(res.token)
            console.log("Esse é para ser o token: ",localStorage.getItem('jwtToken'))

            const informacoesUsuario = this.authService.decodificarJwt(localStorage.getItem('jwtToken') || '')
            console.log(informacoesUsuario);
            
             if(informacoesUsuario.tipo_usuario == 'comum'){
                this.router.navigate(['/home-cliente'])
              };
         
          }
      })
  }
}
