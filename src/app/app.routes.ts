import { Routes } from '@angular/router';
import { TelaCadastroUsuarioComponent } from './telas/tela-cadastro-usuario/tela-cadastro-usuario.component';
import { TelaLoginUsuarioComponent } from './telas/tela-login-usuario/tela-login-usuario.component';
import { TelaValidarOtpComponent } from './telas/tela-validar-otp/tela-validar-otp.component';
import { TelaContasClienteComponent } from './telas/tela-contas-cliente/tela-contas-cliente.component';
import { TelaContaCorrenteComponent } from './telas/contas/conta-corrente/tela-conta-corrente/tela-conta-corrente.component';
import { ContaCorrenteTransferenciaComponent } from './telas/contas/conta-corrente/tela-conta-corrente-transferencia/conta-corrente-transferencia.component';
import { TelaContaPoupancaComponent } from './telas/contas/conta-poupanca/tela-conta-poupanca/tela-conta-poupanca.component';
import { ContaPoupancaTransferenciaComponent } from './telas/contas/conta-poupanca/tela-conta-poupanca-transferencia/conta-poupanca-transferencia.component';

export const routes: Routes = [
    { path: 'home-cliente', component: TelaContasClienteComponent},
    { path: 'conta-corrente', component: TelaContaCorrenteComponent},
        { path: 'conta-corrente/tranferencia', component: ContaCorrenteTransferenciaComponent},
    { path: 'conta-poupanca', component: TelaContaPoupancaComponent},
        { path: 'conta-poupanca/tranferencia', component: ContaPoupancaTransferenciaComponent},
    { path: 'cadastro-usuario', component: TelaCadastroUsuarioComponent},
    { path: 'login', component: TelaLoginUsuarioComponent},
    { path: 'validar-otp', component: TelaValidarOtpComponent}
];

