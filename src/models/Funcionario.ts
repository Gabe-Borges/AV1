import { NivelPermissao } from "../enums/NivelPermissao";

export class Funcionario {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: NivelPermissao;

  constructor(
    id: string,
    nome: string,
    telefone: string,
    endereco: string,
    usuario: string,
    senha: string,
    nivelPermissao: NivelPermissao
  ) {
    this.id = id;
    this.nome = nome;
    this.telefone = telefone;
    this.endereco = endereco;
    this.usuario = usuario;
    this.senha = senha;
    this.nivelPermissao = nivelPermissao;
  }

  autenticar(usuario: string, senha: string): boolean {
    return this.usuario === usuario && this.senha === senha;
  }

  exibirDetalhes(): void {
    console.log(`  ID       : ${this.id}`);
    console.log(`  Nome     : ${this.nome}`);
    console.log(`  Telefone : ${this.telefone}`);
    console.log(`  Endereço : ${this.endereco}`);
    console.log(`  Usuário  : ${this.usuario}`);
    console.log(`  Permissão: ${this.nivelPermissao}`);
  }

  serializar(): string {
    return `${this.id}|${this.nome}|${this.telefone}|${this.endereco}|${this.usuario}|${this.senha}|${this.nivelPermissao}`;
  }

  static desserializar(linha: string): Funcionario {
    const [id, nome, telefone, endereco, usuario, senha, nivelPermissao] = linha.split("|");
    return new Funcionario(id, nome, telefone, endereco, usuario, senha, nivelPermissao as NivelPermissao);
  }
}