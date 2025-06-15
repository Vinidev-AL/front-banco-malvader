import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

//   login() {
//   }

  salvarToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  decodificarJwt(token: string) {
  if (!token) {
    console.error("Token não fornecido!");
    return null;
  }

  try {
    // 1. Divide o token nas suas três partes
    const partes = token.split('.');
    if (partes.length !== 3) {
      throw new Error("Token JWT inválido.");
    }

    // 2. Pega a segunda parte (Payload)
    const payloadBase64 = partes[1];

    // 3. Decodifica de Base64 para string
    // A função atob() decodifica uma string de dados que foi codificada em base-64.
    const payloadJson = atob(payloadBase64);

    // 4. Converte a string JSON para um objeto JavaScript
    const payload = JSON.parse(payloadJson);

    return payload;
  } catch (error: any) {
    console.error("Erro ao decodificar o token JWT:", error.message);
    return null;
  }
}
}
