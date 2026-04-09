import { TipoAeronave } from "../enums/TipoAeronave";
import { Peca } from "./Peca";
import { Etapa } from "./Etapa";
import { Teste } from "./Teste";

export class Aeronave {
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade: number;
  alcance: number;
  pecas: Peca[];
  etapas: Etapa[];
  testes: Teste[];

  constructor(
    codigo: string,
    modelo: string,
    tipo: TipoAeronave,
    capacidade: number,
    alcance: number
  ) {
    this.codigo = codigo;
    this.modelo = modelo;
    this.tipo = tipo;
    this.capacidade = capacidade;
    this.alcance = alcance;
    this.pecas = [];
    this.etapas = [];
    this.testes = [];
  }

  exibirDetalhes(): void {
    console.log("\n========================================");
    console.log(`  AERONAVE: ${this.modelo} [${this.codigo}]`);
    console.log("========================================");
    console.log(`  Tipo      : ${this.tipo}`);
    console.log(`  Capacidade: ${this.capacidade} passageiros`);
    console.log(`  Alcance   : ${this.alcance} km`);

    console.log(`\n  --- PEÇAS (${this.pecas.length}) ---`);
    if (this.pecas.length === 0) {
      console.log("  Nenhuma peça cadastrada.");
    } else {
      this.pecas.forEach((p, i) => {
        console.log(`\n  [${i + 1}]`);
        p.exibirDetalhes();
      });
    }

    console.log(`\n  --- ETAPAS (${this.etapas.length}) ---`);
    if (this.etapas.length === 0) {
      console.log("  Nenhuma etapa cadastrada.");
    } else {
      this.etapas.forEach((e, i) => {
        console.log(`\n  [${i + 1}]`);
        e.exibirDetalhes();
      });
    }

    console.log(`\n  --- TESTES (${this.testes.length}) ---`);
    if (this.testes.length === 0) {
      console.log("  Nenhum teste registrado.");
    } else {
      this.testes.forEach(t => t.exibirDetalhes());
    }

    console.log("========================================\n");
  }

  serializar(): string {
    return `${this.codigo}|${this.modelo}|${this.tipo}|${this.capacidade}|${this.alcance}`;
  }

  static desserializar(linha: string): Aeronave {
    const [codigo, modelo, tipo, capacidade, alcance] = linha.split("|");
    return new Aeronave(codigo, modelo, tipo as TipoAeronave, Number(capacidade), Number(alcance));
  }
}