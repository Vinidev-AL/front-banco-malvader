import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModuloCompartilhadoModule } from '../../../../modulo-compartilhado.module';
import { HeaderComponent } from '../../../../components/header/header.component';
import { ChamadaService } from '../../../../_services/chamada.service';
import { MensagemService } from '../../../../_services/mensagem.service';
import { DadosCompartilhados } from '../../../../_services/dadosCompartilhados.service';
import { of, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';

interface DadosTransferencia {
  id_conta_origem: string;
  id_conta_destino: string;
  tipo_transacao: 'TRANSFERENCIA';
  valor: number;
  data_hora: string;
  descricao: string;
}

interface DestinatarioInfo {
  id_conta_corrente: string;
  nome: string;
  cpf: string;
}

@Component({
  selector: 'app-conta-poupanca-transferencia',
  imports: [ModuloCompartilhadoModule, HeaderComponent],
  templateUrl: './conta-poupanca-transferencia.component.html',
  styleUrl: './conta-poupanca-transferencia.component.scss'
})
export class ContaPoupancaTransferenciaComponent implements OnInit, OnDestroy {
  public forms!: FormGroup;
  private idContaOrigem!: string;
  private destroy$ = new Subject<void>();

  public destinatarioEncontrado: DestinatarioInfo | null = null;
  public buscandoCpf = false;
  public erroCpf: string | null = null;

  constructor(
    private fb: FormBuilder,
    private chamadaService: ChamadaService,
    private mensagemService: MensagemService,
    private router: Router,
    private dadosCompartilhados: DadosCompartilhados
  ) {}

  ngOnInit(): void {
    const dadosUsuario = this.dadosCompartilhados.resgatarDados();
    this.idContaOrigem = dadosUsuario.id_conta_poupanca;

    this.forms = this.fb.group({
      cpf_destino: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      valor: [{ value: null, disabled: true }, [Validators.required, Validators.min(0.01)]],
      descricao: [{ value: '', disabled: true }]
    });

    this.monitorarCampoCpf();
  }

  monitorarCampoCpf(): void {
    this.forms.get('cpf_destino')!.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged(),
      tap(cpf => {
        this.limparBusca();
        this.erroCpf = null;
        if (cpf && cpf.length === 11) {
          this.buscandoCpf = true;
        }
      }),
      switchMap(cpf => {
        if (cpf && cpf.length === 11) {
          return this.chamadaService.chamadaGet(`/conta-corrente/${cpf}`).pipe(
            catchError(error => {
              console.error('Erro ao buscar CPF:', error);
              this.erroCpf = 'CPF não encontrado ou erro na busca.';
              return of(null);
            })
          );
        }
        return of(null);
      })
    ).subscribe({
      next: (res: DestinatarioInfo | null) => {
        this.buscandoCpf = false;
        if (res && res.id_conta_corrente) {
          this.destinatarioEncontrado = res;
          this.erroCpf = null;
          this.forms.get('valor')?.enable();
          this.forms.get('descricao')?.enable();
        } else {
          this.limparBusca();
        }
      }
    });
  }

  limparBusca(): void {
    this.destinatarioEncontrado = null;
    this.forms.get('valor')?.disable();
    this.forms.get('descricao')?.disable();
    this.forms.get('valor')?.reset();
    this.forms.get('descricao')?.reset();
  }

  realizarTransferencia(): void {
    if (this.forms.invalid || !this.destinatarioEncontrado) {
      this.mensagemService.mensagemAlerta('Verifique os dados antes de continuar.');
      return;
    }

    const dadosParaEnvio: DadosTransferencia = {
      id_conta_origem: this.idContaOrigem,
      id_conta_destino: this.destinatarioEncontrado.id_conta_corrente,
      valor: this.forms.value.valor,
      descricao: this.forms.value.descricao || 'Transferência entre contas',
      tipo_transacao: 'TRANSFERENCIA',
      data_hora: new Date().toISOString()
    };

    this.chamadaService.chamadaPost('/transacao', dadosParaEnvio).subscribe(res => {
      if (!res?.erro) {
        this.mensagemService.mensagemSucesso(res.mensagem, 4000);
        this.router.navigate(['/conta-poupanca']);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/conta-poupanca']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
