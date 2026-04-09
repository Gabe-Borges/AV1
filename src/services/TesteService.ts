import { Aeronave } from "../models/Aeronave";
import { Teste } from "../models/Teste";
import { TipoTeste } from "../enums/TipoTeste";
import { ResultadoTeste } from "../enums/ResultadoTeste";
import { salvarTestes } from "../persistence/DataLoader";

export class TesteService {
  registrar(aeronave: Aeronave, tipo: TipoTeste, resultado: ResultadoTeste): Teste {
    const teste = new Teste(tipo, resultado);
    aeronave.testes.push(teste);
    salvarTestes(aeronave.codigo, aeronave.testes);
    console.log(`\nTeste ${tipo} registrado: ${resultado}`);
    return teste;
  }

  listar(aeronave: Aeronave): void {
    if (aeronave.testes.length === 0) {
      console.log("\nNenhum teste registrado para esta aeronave.");
      return;
    }
    console.log(`\n========== TESTES - ${aeronave.modelo} ==========`);
    aeronave.testes.forEach((t, i) => {
      process.stdout.write(`  ${i + 1}. `);
      t.exibirDetalhes();
    });
    const aprovados = aeronave.testes.filter(t => t.resultado === ResultadoTeste.APROVADO).length;
    console.log(`\n  Aprovados: ${aprovados} / ${aeronave.testes.length}`);
    console.log("=".repeat(44));
  }
}