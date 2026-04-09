import { Aeronave } from "../models/Aeronave";
import { Relatorio } from "../models/Relatorio";

export class RelatorioService {
  gerar(aeronave: Aeronave, nomeCliente: string, dataEntrega: string): Relatorio {
    const relatorio = new Relatorio(aeronave, nomeCliente, dataEntrega);
    const conteudo = relatorio.gerar();

    console.log("\n" + conteudo);

    const caminho = relatorio.salvarEmArquivo();
    console.log(`\nRelatório salvo em: ${caminho}`);

    return relatorio;
  }
}