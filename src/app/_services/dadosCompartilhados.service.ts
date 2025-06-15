import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DadosCompartilhados {

    definirDados(dados: any){
        localStorage.setItem('dados', JSON.stringify(dados))
    }

    resgatarDados(){
        return JSON.parse(localStorage.getItem('dados') || '');
    }
}
