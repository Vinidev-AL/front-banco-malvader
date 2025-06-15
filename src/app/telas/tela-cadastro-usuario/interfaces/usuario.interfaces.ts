export interface DadosParaEnvio {
  nome?: string,
  cpf?: string,
  data_nascimento?: string,
  tipo_usuario?: string,
  telefone?: string,
  senha_hash?: string,
  otp_ativo?: true
}
