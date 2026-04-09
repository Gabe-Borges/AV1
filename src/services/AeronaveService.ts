import { Aeronave } from "../models/Aeronave";
import { TipoAeronave } from "../enums/TipoAeronave";
import { salvarAeronaves } from "../persistence/DataLoader";

export class AeronaveService {
  private aeronaves: Aeronave[];

  constructor(aeronaves: Aeronave[]) {
    this.aeronaves = aeronaves;
  }

  cadastrar(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number): Aeronave | null {
    if (this.aeronaves.some(a => a.codigo === codigo)) {
      console.log(`\n[ERRO] Já existe uma aeronave com o código "${codigo}".`);
      return null;
    }
    const nova = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
    this.aeronaves.push(nova);
    salvarAeronaves(this.aeronaves);
    console.log(`\nAeronave "${modelo}" (${codigo}) cadastrada com sucesso.`);
    return nova;
  }

  buscarPorCodigo(codigo: string): Aeronave | null {
    return this.aeronaves.find(a => a.codigo === codigo) ?? null;
  }

  listarTodas(): void {
    if (this.aeronaves.length === 0) {
      console.log("\nNenhuma aeronave cadastrada.");
      return;
    }
    console.log("\n========== AERONAVES CADASTRADAS ==========");
    this.aeronaves.forEach((a, i) => {
      console.log(`  ${i + 1}. [${a.codigo}] ${a.modelo} | ${a.tipo} | Cap: ${a.capacidade} | Alcance: ${a.alcance} km`);
    });
    console.log("===========================================");
  }

  getAeronaves(): Aeronave[] {
    return this.aeronaves;
  }
}