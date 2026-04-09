import { salvarLinhas, carregarLinhas } from "./FileStorage";
import { Aeronave } from "../models/Aeronave";
import { Peca } from "../models/Peca";
import { Etapa } from "../models/Etapa";
import { Funcionario } from "../models/Funcionario";
import { Teste } from "../models/Teste";

// ─── Funcionários ────────────────────────────────────────────────────────────

export function salvarFuncionarios(funcionarios: Funcionario[]): void {
  salvarLinhas("funcionarios.txt", funcionarios.map(f => f.serializar()));
}

export function carregarFuncionarios(): Funcionario[] {
  return carregarLinhas("funcionarios.txt").map(Funcionario.desserializar);
}

// ─── Aeronaves (metadados) ───────────────────────────────────────────────────

export function salvarAeronaves(aeronaves: Aeronave[]): void {
  salvarLinhas("aeronaves.txt", aeronaves.map(a => a.serializar()));
}

export function carregarAeronaves(): Aeronave[] {
  return carregarLinhas("aeronaves.txt").map(Aeronave.desserializar);
}

// ─── Peças ───────────────────────────────────────────────────────────────────

export function salvarPecas(codigoAeronave: string, pecas: Peca[]): void {
  salvarLinhas(`pecas_${codigoAeronave}.txt`, pecas.map(p => p.serializar()));
}

export function carregarPecas(codigoAeronave: string): Peca[] {
  return carregarLinhas(`pecas_${codigoAeronave}.txt`).map(Peca.desserializar);
}

// ─── Etapas ──────────────────────────────────────────────────────────────────

export function salvarEtapas(codigoAeronave: string, etapas: Etapa[], funcionarios: Funcionario[]): void {
  const linhas = etapas.map(e => {
    const ids = e.funcionarios.map(f => f.id).join(";");
    return `${e.nome}|${e.prazo}|${e.status}|${ids}`;
  });
  salvarLinhas(`etapas_${codigoAeronave}.txt`, linhas);
}

export function carregarEtapas(codigoAeronave: string, funcionarios: Funcionario[]): Etapa[] {
  return carregarLinhas(`etapas_${codigoAeronave}.txt`).map(linha => {
    const partes = linha.split("|");
    const etapa = Etapa.desserializar(linha);
    const ids = partes[3] ? partes[3].split(";").filter(id => id !== "") : [];
    etapa.funcionarios = ids
      .map(id => funcionarios.find(f => f.id === id))
      .filter((f): f is Funcionario => f !== undefined);
    return etapa;
  });
}

// ─── Testes ──────────────────────────────────────────────────────────────────

export function salvarTestes(codigoAeronave: string, testes: Teste[]): void {
  salvarLinhas(`testes_${codigoAeronave}.txt`, testes.map(t => t.serializar()));
}

export function carregarTestes(codigoAeronave: string): Teste[] {
  return carregarLinhas(`testes_${codigoAeronave}.txt`).map(Teste.desserializar);
}

// ─── Carga completa ───────────────────────────────────────────────────────────

export function carregarTudo(aeronaves: Aeronave[], funcionarios: Funcionario[]): void {
  for (const aeronave of aeronaves) {
    aeronave.pecas = carregarPecas(aeronave.codigo);
    aeronave.etapas = carregarEtapas(aeronave.codigo, funcionarios);
    aeronave.testes = carregarTestes(aeronave.codigo);
  }
}

// ─── Salvar tudo ─────────────────────────────────────────────────────────────

export function salvarTudo(aeronaves: Aeronave[], funcionarios: Funcionario[]): void {
  salvarAeronaves(aeronaves);
  salvarFuncionarios(funcionarios);
  for (const aeronave of aeronaves) {
    salvarPecas(aeronave.codigo, aeronave.pecas);
    salvarEtapas(aeronave.codigo, aeronave.etapas, funcionarios);
    salvarTestes(aeronave.codigo, aeronave.testes);
  }
}