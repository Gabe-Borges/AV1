import { Aeronave } from "../models/Aeronave";
import { Peca } from "../models/Peca";
import { TipoPeca } from "../enums/TipoPeca";
import { StatusPeca } from "../enums/StatusPeca";
import { salvarPecas } from "../persistence/DataLoader";

export class PecaService {
  adicionar(aeronave: Aeronave, nome: string, tipo: TipoPeca, fornecedor: string): Peca {
    const peca = new Peca(nome, tipo, fornecedor);
    aeronave.pecas.push(peca);
    salvarPecas(aeronave.codigo, aeronave.pecas);
    console.log(`\nPeça "${nome}" adicionada à aeronave "${aeronave.modelo}".`);
    return peca;
  }

  atualizarStatus(aeronave: Aeronave, indicePeca: number, novoStatus: StatusPeca): boolean {
    const peca = aeronave.pecas[indicePeca];
    if (!peca) {
      console.log("\n[ERRO] Peça não encontrada.");
      return false;
    }
    peca.atualizarStatus(novoStatus);
    salvarPecas(aeronave.codigo, aeronave.pecas);
    return true;
  }

  listar(aeronave: Aeronave): void {
    if (aeronave.pecas.length === 0) {
      console.log("\nNenhuma peça cadastrada para esta aeronave.");
      return;
    }
    console.log(`\n========== PEÇAS - ${aeronave.modelo} ==========`);
    aeronave.pecas.forEach((p, i) => {
      console.log(`\n  [${i + 1}]`);
      p.exibirDetalhes();
    });
    console.log("=".repeat(44));
  }
}