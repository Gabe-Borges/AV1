import * as rl from "readline-sync";
import { PecaService } from "../services/PecaService";
import { AeronaveService } from "../services/AeronaveService";
import { AuthService } from "../services/AuthService";
import { NivelPermissao } from "../enums/NivelPermissao";
import { TipoPeca } from "../enums/TipoPeca";
import { StatusPeca } from "../enums/StatusPeca";
import { Aeronave } from "../models/Aeronave";

export class MenuPeca {
  constructor(
    private pecaService: PecaService,
    private aeronaveService: AeronaveService,
    private authService: AuthService
  ) {}

  exibir(): void {
    let continuar = true;
    while (continuar) {
      console.log("\n===== GESTÃO DE PEÇAS =====");
      console.log("1. Adicionar peça a uma aeronave");
      console.log("2. Listar peças de uma aeronave");
      console.log("3. Atualizar status de peça");
      console.log("0. Voltar");

      const opcao = rl.question("\nOpção: ").trim();

      switch (opcao) {
        case "1": this.adicionar(); break;
        case "2": this.listar(); break;
        case "3": this.atualizarStatus(); break;
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

  private adicionar(): void {
    if (!this.authService.exigirPermissao(NivelPermissao.ENGENHEIRO)) return;

    const aeronave = this.selecionarAeronave();
    if (!aeronave) return;

    console.log("\n--- Cadastro de Peça ---");
    const nome = rl.question("Nome da peça   : ").trim();
    const fornecedor = rl.question("Fornecedor     : ").trim();

    const tipos = Object.values(TipoPeca);
    tipos.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
    const idx = rl.questionInt("Tipo (número)  : ") - 1;
    if (idx < 0 || idx >= tipos.length) { console.log("\n[ERRO] Tipo inválido."); return; }

    this.pecaService.adicionar(aeronave, nome, tipos[idx], fornecedor);
  }

  private listar(): void {
    const aeronave = this.selecionarAeronave();
    if (!aeronave) return;
    this.pecaService.listar(aeronave);
  }

  private atualizarStatus(): void {
    if (!this.authService.exigirPermissao(NivelPermissao.OPERADOR)) return;

    const aeronave = this.selecionarAeronave();
    if (!aeronave) return;

    this.pecaService.listar(aeronave);
    if (aeronave.pecas.length === 0) return;

    const indice = rl.questionInt("\nNúmero da peça: ") - 1;

    const status = Object.values(StatusPeca);
    status.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
    const idx = rl.questionInt("Novo status (número): ") - 1;
    if (idx < 0 || idx >= status.length) { console.log("\n[ERRO] Status inválido."); return; }

    this.pecaService.atualizarStatus(aeronave, indice, status[idx]);
  }
}