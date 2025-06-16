import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LoaderService } from './loader.service';
import { Observable, catchError, finalize, from, tap, throwError } from 'rxjs';
import { MensagemService } from './mensagem.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChamadaService {

  baseURlApi = 'http://localhost:3001'

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private mensagemService: MensagemService
  ) { }

  estabeleObjetoValoresFormulario(form: FormGroup): any {
    return Object.keys(form.controls).reduce((acc, key) => {
      acc[key as keyof any] = form.get(key)?.value;
      return acc;
    }, {} as any);
  }

  chamadaPost(endpoint: string, objetoDeEnvio: any): Observable<any> {
    this.loaderService.setLoader(true);
    const url = `${this.baseURlApi}${endpoint}`;

    return this.http.post(url, objetoDeEnvio).pipe(
      tap((data: any) => {
        if (data.erro) {
          console.log("Esse é o data: ", data)
          this.mensagemService.mensagemErro(`${data.mensagem}`);
        }
        this.loaderService.setLoader(false);
      }),
      catchError((error) => {
        this.loaderService.setLoader(false);

        const mensagem = error?.error?.mensagem || 'Erro na requisição';
        this.mensagemService.mensagemErro(mensagem);

        return throwError(() => error);
      })

    );
  }

    chamadaPatch(endpoint: string, objetoDeEnvio: any): Observable<any> {
    this.loaderService.setLoader(true);
    const url = `${this.baseURlApi}${endpoint}`;

    return this.http.patch(url, objetoDeEnvio).pipe(
      tap((data: any) => {
        if (data.erro) {
          console.log("Esse é o data: ", data)
          this.mensagemService.mensagemErro(`${data.mensagem}`);
        }
        this.loaderService.setLoader(false);
      }),
      catchError((error) => {
        this.loaderService.setLoader(false);

        const mensagem = error?.error?.mensagem || 'Erro na requisição';
        this.mensagemService.mensagemErro(mensagem);

        return throwError(() => error);
      })

    );
  }

chamadaGet(endpoint: string): Observable<any> {
  this.loaderService.setLoader(true);
  const url = `${this.baseURlApi}${endpoint}`;

  return this.http.get(url).pipe(
    tap((data: any) => {
      if (data.erro) {
        console.log("Esse é o data: ", data);
        this.mensagemService.mensagemErro(`${data.mensagem}`, 3000);
      }
    }),
    catchError((error) => {
      const mensagem = error?.error?.mensagem || 'Erro na requisição';
      this.mensagemService.mensagemErro(mensagem, 3000);
      return throwError(() => error);
    }),
    finalize(() => {
      this.loaderService.setLoader(false);
    })
  );
}

}

