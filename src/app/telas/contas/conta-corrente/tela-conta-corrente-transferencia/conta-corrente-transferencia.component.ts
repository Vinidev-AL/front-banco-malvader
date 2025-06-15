
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModuloCompartilhadoModule } from '../../../../modulo-compartilhado.module';
import { HeaderComponent } from '../../../../components/header/header.component';
import { ChamadaService } from '../../../../_services/chamada.service';
import { MensagemService } from '../../../../_services/mensagem.service';
import { DadosCompartilhados } from '../../../../_services/dadosCompartilhados.service';
import { EMPTY, of, Subject, timer } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';

// Interface para o payload da transferência (continua a mesma)
interface DadosTransferencia {
  id_conta_origem: string;
  id_conta_destino: string;
  tipo_transacao: 'TRANSFERENCIA';
  valor: number;
  data_hora: string;
  descricao: string;
}

// NOVA interface para os dados do destinatário retornados pela API
interface DestinatarioInfo {
  id_conta_corrente: string;
  nome: string;
  cpf: string; // Pode ser útil para confirmação
  // Adicione outros campos que sua API retornar, como agência e conta
}

@Component({
  selector: 'app-conta-corrente-transferencia',
  imports: [ModuloCompartilhadoModule, HeaderComponent],
  templateUrl: './conta-corrente-transferencia.component.html',
  styleUrl: './conta-corrente-transferencia.component.scss'
})
export class ContaCorrenteTransferenciaComponent {
  public forms!: FormGroup;
  private idContaOrigem!: string;
  private destroy$ = new Subject<void>();

  // Estado do componente para controlar o fluxo
  public destinatarioEncontrado: DestinatarioInfo | null = null;
  public buscandoCpf = false;
  public erroCpf: string | null = null;

  constructor(
    private fb: FormBuilder,
    private chamadaService: ChamadaService,
    private mensagemService: MensagemService,
    private router: Router,
    private dadosCompartilhados: DadosCompartilhados
  ) { }

  ngOnInit(): void {
    const dadosUsuario = this.dadosCompartilhados.resgatarDados();
    this.idContaOrigem = dadosUsuario.id_conta_corrente;

    this.forms = this.fb.group({
      cpf_destino: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      valor: [{ value: null, disabled: true }, [Validators.required, Validators.min(0.01)]],
      descricao: [{ value: '', disabled: true }]
    });

    this.monitorarCampoCpf();
  }

 // Detecta mudanças no campo CPF para fazer a busca automática
monitorarCampoCpf(): void {
  this.forms.get('cpf_destino')!.valueChanges.pipe(
    takeUntil(this.destroy$),
    debounceTime(500), // Espera 500ms após o usuário parar de digitar
    distinctUntilChanged(), // Só continua se o valor realmente mudou
    tap(cpf => {
      // Reseta o estado sempre que o usuário digita
      this.limparBusca(); 
      this.erroCpf = null;
      // Mostra o spinner de busca apenas se o CPF tiver o tamanho certo
      if (cpf && cpf.length === 11) {
        this.buscandoCpf = true;
      }
    }),
    // Faz a chamada à API apenas se o CPF tiver 11 dígitos
    switchMap(cpf => {
      if (cpf && cpf.length === 11) {
        // **AQUI ESTÁ A MUDANÇA PRINCIPAL**
        return this.chamadaService.chamadaGet(`/conta-corrente/${cpf}`).pipe(
          // Captura o erro da chamada HTTP ANTES que ele destrua o valueChanges
          catchError(error => {
            console.error('Erro ao buscar CPF:', error);
            this.erroCpf = 'CPF não encontrado ou erro na busca.';
            // Retorna um observable "seguro" (nulo) para o stream principal continuar
            return of(null); 
          })
        );
      }
      // Se o CPF não for válido, retorna um observable nulo para limpar os resultados
      return of(null); 
    })
  ).subscribe({
    next: (res: DestinatarioInfo | null) => {
      this.buscandoCpf = false; // Para o spinner
      
      if (res && res.id_conta_corrente) {
        // Sucesso: encontramos um destinatário
        this.destinatarioEncontrado = res;
        this.erroCpf = null;
        this.forms.get('valor')?.enable();
        this.forms.get('descricao')?.enable();
      } else {
        // Se res for nulo (seja por CPF inválido ou por erro capturado),
        // garantimos que o formulário fique travado.
        this.limparBusca();
      }
    }
    // O bloco 'error' aqui agora só seria chamado por um erro inesperado no código
    // do 'tap' ou 'switchMap', e não mais por erros de API.
  });
}

// Pequeno ajuste na função limparBusca para garantir que o erro também seja limpo visualmente
limparBusca(): void {
  this.destinatarioEncontrado = null;
  // this.erroCpf = null; // Removido daqui para que o erro da busca persista até nova digitação
  this.forms.get('valor')?.disable();
  this.forms.get('descricao')?.disable();
  this.forms.get('valor')?.reset();
  this.forms.get('descricao')?.reset();
}

  realizarTransferencia(): void {
    if (this.forms.invalid || !this.destinatarioEncontrado) {
      this.mensagemService.mensagemAlerta("Verifique os dados antes de continuar.");
      return;
    }

    const dadosParaEnvio: DadosTransferencia = {
      id_conta_origem: this.idContaOrigem,
      id_conta_destino: this.destinatarioEncontrado.id_conta_corrente, // Usa o ID encontrado
      valor: this.forms.value.valor,
      descricao: this.forms.value.descricao || 'Transferência entre contas',
      tipo_transacao: 'TRANSFERENCIA',
      data_hora: new Date().toISOString()
    };

    // ... (lógica de chamada POST continua a mesma)
    this.chamadaService.chamadaPost('/transacao', dadosParaEnvio).subscribe(res => {

      if(!res?.erro){
        this.mensagemService.mensagemSucesso(res.mensagem, 4000);
        this.router.navigate(['/conta-corrente']);
      }
      
    }
    )
  }

  voltar(): void {
    this.router.navigate(['/conta-corrente']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

