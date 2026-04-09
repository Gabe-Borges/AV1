import { Aeronave } from "../models/Aeronave";
import { Etapa } from "../models/Etapa";
import { Funcionario } from "../models/Funcionario";
import { salvarEtapas } from "../persistence/DataLoader";

export class EtapaService {
  adicionar(aeronave: Aeronave, nome: string, prazo: string, funcionarios: Funcionario[]): Etapa {
    const etapa = new Etapa(nome, prazo);
    aeronave.etapas.push(etapa);
    salvarEtapas(aeronave.codigo, aeronave.etapas, funcionarios);
    console.log(`\nEtapa "${nome}" adicionada à aeronave "${aeronave.modelo}".`);
    return etapa;
  }

  iniciar(aeronave: Aeronave, indice: number, funcionarios: Funcionario[]): boolean {
    const etapa = aeronave.etapas[indice];
    if (!etapa) {
      console.log("\n[ERRO] Etapa não encontrada.");
      return false;
    }
    const resultado = etapa.iniciar();
    if (resultado) salvarEtapas(aeronave.codigo, aeronave.etapas, funcionarios);
    return resultado;
  }

  finalizar(aeronave: Aeronave, indice: number, funcionarios: Funcionario[]): boolean {
    const etapa = aeronave.etapas[indice];
    if (!etapa) {
      console.log("\n[ERRO] Etapa não encontrada.");
      return false;
    }
    const etapaAnterior = indice > 0 ? aeronave.etapas[indice - 1] : undefined;
    const resultado = etapa.finalizar(etapaAnterior);
    if (resultado) salvarEtapas(aeronave.codigo, aeronave.etapas, funcionarios);
    return resultado;
  }

  associarFuncionario(
    aeronave: Aeronave,
    indiceEtapa: number,
    funcionario: Funcionario,
    todosFuncionarios: Funcionario[]
  ): boolean {
    const etapa = aeronave.etapas[indiceEtapa];
    if (!etapa) {
      console.log("\n[ERRO] Etapa não encontrada.");
      return false;
    }
    const resultado = etapa.associarFuncionario(funcionario);
    if (resultado) salvarEtapas(aeronave.codigo, aeronave.etapas, todosFuncionarios);
    return resultado;
  }

  listar(aeronave: Aeronave): void {
    if (aeronave.etapas.length === 0) {
      console.log("\nNenhuma etapa cadastrada para esta aeronave.");
      return;
    }
    console.log(`\n========== ETAPAS - ${aeronave.modelo} ==========`);
    aeronave.etapas.forEach((e, i) => {
      console.log(`\n  [${i + 1}]`);
      e.exibirDetalhes();
    });
    console.log("=".repeat(44));
  }
}