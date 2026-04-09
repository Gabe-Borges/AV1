import { StatusEtapa } from "../enums/StatusEtapa";
import { Funcionario } from "./Funcionario";

export class Etapa {
  nome: string;
  prazo: string;
  status: StatusEtapa;
  funcionarios: Funcionario[];

  constructor(nome: string, prazo: string, status: StatusEtapa = StatusEtapa.PENDENTE) {
    this.nome = nome;
    this.prazo = prazo;
    this.status = status;
    this.funcionarios = [];
  }

  iniciar(): boolean {
    if (this.status !== StatusEtapa.PENDENTE) {
      console.log(`\n[ERRO] A etapa "${this.nome}" não está pendente. Status atual: ${this.status}`);
      return false;
    }
    this.status = StatusEtapa.ANDAMENTO;
    console.log(`\nEtapa "${this.nome}" iniciada com sucesso.`);
    return true;
  }

  finalizar(etapaAnterior?: Etapa): boolean {
    if (etapaAnterior && etapaAnterior.status !== StatusEtapa.CONCLUIDA) {
      console.log(`\n[ERRO] A etapa anterior "${etapaAnterior.nome}" ainda não foi concluída.`);
      return false;
    }
    if (this.status !== StatusEtapa.ANDAMENTO) {
      console.log(`\n[ERRO] A etapa "${this.nome}" não está em andamento. Status atual: ${this.status}`);
      return false;
    }
    this.status = StatusEtapa.CONCLUIDA;
    console.log(`\nEtapa "${this.nome}" concluída com sucesso.`);
    return true;
  }

  associarFuncionario(funcionario: Funcionario): boolean {
    const jaAssociado = this.funcionarios.some(f => f.id === funcionario.id);
    if (jaAssociado) {
      console.log(`\n[AVISO] Funcionário "${funcionario.nome}" já está associado a esta etapa.`);
      return false;
    }
    this.funcionarios.push(funcionario);
    console.log(`\nFuncionário "${funcionario.nome}" associado à etapa "${this.nome}".`);
    return true;
  }

  listarFuncionarios(): void {
    if (this.funcionarios.length === 0) {
      console.log("  Nenhum funcionário associado.");
      return;
    }
    this.funcionarios.forEach((f, i) => {
      console.log(`  ${i + 1}. ${f.nome} (${f.nivelPermissao})`);
    });
  }

  exibirDetalhes(): void {
    console.log(`  Etapa    : ${this.nome}`);
    console.log(`  Prazo    : ${this.prazo}`);
    console.log(`  Status   : ${this.status}`);
    console.log(`  Responsáveis:`);
    this.listarFuncionarios();
  }

  serializar(): string {
    const ids = this.funcionarios.map(f => f.id).join(";");
    return `${this.nome}|${this.prazo}|${this.status}|${ids}`;
  }

  static desserializar(linha: string): Etapa {
    const partes = linha.split("|");
    const etapa = new Etapa(partes[0], partes[1], partes[2] as StatusEtapa);
    // IDs dos funcionários são restaurados pelo DataLoader
    return etapa;
  }
}