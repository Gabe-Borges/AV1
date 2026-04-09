import { Funcionario } from "../models/Funcionario";
import { NivelPermissao } from "../enums/NivelPermissao";

export class AuthService {
  private funcionarioLogado: Funcionario | null = null;

  login(funcionarios: Funcionario[], usuario: string, senha: string): boolean {
    const encontrado = funcionarios.find(f => f.autenticar(usuario, senha));
    if (encontrado) {
      this.funcionarioLogado = encontrado;
      console.log(`\nBem-vindo, ${encontrado.nome}! Nível: ${encontrado.nivelPermissao}`);
      return true;
    }
    console.log("\n[ERRO] Usuário ou senha inválidos.");
    return false;
  }

  logout(): void {
    if (this.funcionarioLogado) {
      console.log(`\nSessão encerrada para ${this.funcionarioLogado.nome}.`);
    }
    this.funcionarioLogado = null;
  }

  estaLogado(): boolean {
    return this.funcionarioLogado !== null;
  }

  getFuncionarioLogado(): Funcionario | null {
    return this.funcionarioLogado;
  }

  temPermissao(nivel: NivelPermissao): boolean {
    if (!this.funcionarioLogado) return false;

    const hierarquia: NivelPermissao[] = [
      NivelPermissao.OPERADOR,
      NivelPermissao.ENGENHEIRO,
      NivelPermissao.ADMINISTRADOR,
    ];

    const nivelUsuario = hierarquia.indexOf(this.funcionarioLogado.nivelPermissao);
    const nivelRequerido = hierarquia.indexOf(nivel);

    return nivelUsuario >= nivelRequerido;
  }

  exigirPermissao(nivel: NivelPermissao): boolean {
    if (!this.temPermissao(nivel)) {
      console.log(`\n[ACESSO NEGADO] Esta operação exige nível: ${nivel}.`);
      console.log(`Seu nível atual: ${this.funcionarioLogado?.nivelPermissao ?? "nenhum"}`);
      return false;
    }
    return true;
  }
}