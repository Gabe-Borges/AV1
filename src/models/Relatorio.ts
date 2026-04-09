import * as fs from "fs";
import * as path from "path";
import { Aeronave } from "./Aeronave";
import { ResultadoTeste } from "../enums/ResultadoTeste";

export class Relatorio {
  aeronave: Aeronave;
  nomeCliente: string;
  dataEntrega: string;

  constructor(aeronave: Aeronave, nomeCliente: string, dataEntrega: string) {
    this.aeronave = aeronave;
    this.nomeCliente = nomeCliente;
    this.dataEntrega = dataEntrega;
  }

  gerar(): string {
    const linhas: string[] = [];
    const sep = "=".repeat(50);
    const sepMin = "-".repeat(50);

    linhas.push(sep);
    linhas.push("        AEROCODE - RELATORIO DE ENTREGA");
    linhas.push(sep);
    linhas.push(`Data de emissao : ${new Date().toLocaleString("pt-BR")}`);
    linhas.push(`Data de entrega : ${this.dataEntrega}`);
    linhas.push(`Cliente         : ${this.nomeCliente}`);
    linhas.push(sepMin);

    linhas.push("AERONAVE");
    linhas.push(`  Codigo      : ${this.aeronave.codigo}`);
    linhas.push(`  Modelo      : ${this.aeronave.modelo}`);
    linhas.push(`  Tipo        : ${this.aeronave.tipo}`);
    linhas.push(`  Capacidade  : ${this.aeronave.capacidade} passageiros`);
    linhas.push(`  Alcance     : ${this.aeronave.alcance} km`);
    linhas.push(sepMin);

    linhas.push(`PECAS UTILIZADAS (${this.aeronave.pecas.length})`);
    if (this.aeronave.pecas.length === 0) {
      linhas.push("  Nenhuma peca registrada.");
    } else {
      this.aeronave.pecas.forEach((p, i) => {
        linhas.push(`  ${i + 1}. ${p.nome} | ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status}`);
      });
    }
    linhas.push(sepMin);

    linhas.push(`ETAPAS REALIZADAS (${this.aeronave.etapas.length})`);
    if (this.aeronave.etapas.length === 0) {
      linhas.push("  Nenhuma etapa registrada.");
    } else {
      this.aeronave.etapas.forEach((e, i) => {
        linhas.push(`  ${i + 1}. ${e.nome} | Prazo: ${e.prazo} | Status: ${e.status}`);
        if (e.funcionarios.length > 0) {
          const nomes = e.funcionarios.map(f => f.nome).join(", ");
          linhas.push(`     Responsaveis: ${nomes}`);
        }
      });
    }
    linhas.push(sepMin);

    linhas.push(`RESULTADOS DOS TESTES (${this.aeronave.testes.length})`);
    if (this.aeronave.testes.length === 0) {
      linhas.push("  Nenhum teste registrado.");
    } else {
      this.aeronave.testes.forEach((t, i) => {
        linhas.push(`  ${i + 1}. ${t.tipo} : ${t.resultado}`);
      });
    }

    const aprovados = this.aeronave.testes.filter(t => t.resultado === ResultadoTeste.APROVADO).length;
    const reprovados = this.aeronave.testes.length - aprovados;
    linhas.push(`  Aprovados: ${aprovados} | Reprovados: ${reprovados}`);
    linhas.push(sepMin);

    const apta = reprovados === 0 ? "SIM - APTA PARA ENTREGA" : "NAO - POSSUI TESTES REPROVADOS";
    linhas.push(`SITUACAO FINAL: ${apta}`);
    linhas.push(sep);

    return linhas.join("\n");
  }

  salvarEmArquivo(): string {
    const conteudo = this.gerar();
    const dir = path.join(process.cwd(), "relatorios");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const nomeArquivo = `relatorio_${this.aeronave.codigo}_${Date.now()}.txt`;
    const caminho = path.join(dir, nomeArquivo);
    fs.writeFileSync(caminho, conteudo, "utf-8");
    return caminho;
  }
}