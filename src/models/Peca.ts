import { TipoPeca } from "../enums/TipoPeca";
import { StatusPeca } from "../enums/StatusPeca";

export class Peca {
  nome: string;
  tipo: TipoPeca;
  fornecedor: string;
  status: StatusPeca;

  constructor(nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca = StatusPeca.EM_PRODUCAO) {
    this.nome = nome;
    this.tipo = tipo;
    this.fornecedor = fornecedor;
    this.status = status;
  }

  atualizarStatus(novoStatus: StatusPeca): void {
    this.status = novoStatus;
    console.log(`\nStatus da peça "${this.nome}" atualizado para: ${novoStatus}`);
  }

  exibirDetalhes(): void {
    console.log(`  Peça     : ${this.nome}`);
    console.log(`  Tipo     : ${this.tipo}`);
    console.log(`  Fornecedor: ${this.fornecedor}`);
    console.log(`  Status   : ${this.status}`);
  }

  serializar(): string {
    return `${this.nome}|${this.tipo}|${this.fornecedor}|${this.status}`;
  }

  static desserializar(linha: string): Peca {
    const [nome, tipo, fornecedor, status] = linha.split("|");
    return new Peca(nome, tipo as TipoPeca, fornecedor, status as StatusPeca);
  }
}