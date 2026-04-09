import * as rl from "readline-sync";
import { TesteService } from "../services/TesteService";
import { AeronaveService } from "../services/AeronaveService";
import { AuthService } from "../services/AuthService";
import { NivelPermissao } from "../enums/NivelPermissao";
import { TipoTeste } from "../enums/TipoTeste";
import { ResultadoTeste } from "../enums/ResultadoTeste";
import { Aeronave } from "../models/Aeronave";

export class MenuTeste {
  constructor(
    private testeService: TesteService,
    private aeronaveService: AeronaveService,
    private authService: AuthService
  ) {}

  exibir(): void {
    let continuar = true;
    while (continuar) {
      console.log("\n===== GESTÃO DE TESTES =====");
      console.log("1. Registrar teste");
      console.log("2. Listar testes de aeronave");
      console.log("0. Voltar");

      const opcao = rl.question("\nOpção: ").trim();

      switch (opcao) {
        case "1": this.registrar(); break;
        case "2": this.listar(); break;
        case "0": continuar = false; break;
        default: console.log("\n[AVISO] Opção inválida.");
      }
    }
  }

  private selecionarAeronave(): Aeronave | null {
    this.aeronaveService.listarTodas();
    const codigo = rl.question("\nCódigo da aeronave: ").trim();
    const aeronave = this.aeronaveService.buscarPorCodigo(codigo);
    if (!aeronave) console.log("\n[ERRO] Aeronave não encontrada.");
    return aeronave;
  }

  private registrar(): void {
    if (!this.authService.exigirPermissao(NivelPermissao.ENGENHEIRO)) return;

    const aeronave = this.selecionarAeronave();
    if (!aeronave) return;

    console.log("\n--- Registro de Teste ---");

    const tipos = Object.values(TipoTeste);
    console.log("\nTipo de teste:");
    tipos.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
    const idxTipo = rl.questionInt("Escolha (número): ") - 1;
    if (idxTipo < 0 || idxTipo >= tipos.length) { console.log("\n[ERRO] Tipo inválido."); return; }

    const resultados = Object.values(ResultadoTeste);
    console.log("\nResultado:");
    resultados.forEach((r, i) => console.log(`  ${i + 1}. ${r}`));
    const idxRes = rl.questionInt("Escolha (número): ") - 1;
    if (idxRes < 0 || idxRes >= resultados.length) { console.log("\n[ERRO] Resultado inválido."); return; }

    this.testeService.registrar(aeronave, tipos[idxTipo], resultados[idxRes]);
  }

  private listar(): void {
    const aeronave = this.selecionarAeronave();
    if (!aeronave) return;
    this.testeService.listar(aeronave);
  }
}