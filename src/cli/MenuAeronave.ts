import * as rl from "readline-sync";
import { AeronaveService } from "../services/AeronaveService";
import { RelatorioService } from "../services/RelatorioService";
import { AuthService } from "../services/AuthService";
import { NivelPermissao } from "../enums/NivelPermissao";
import { TipoAeronave } from "../enums/TipoAeronave";

export class MenuAeronave {
  constructor(
    private aeronaveService: AeronaveService,
    private relatorioService: RelatorioService,
    private authService: AuthService
  ) {}

  exibir(): void {
    let continuar = true;
    while (continuar) {
      console.log("\n===== GESTÃO DE AERONAVES =====");
      console.log("1. Cadastrar aeronave");
      console.log("2. Listar aeronaves");
      console.log("3. Exibir detalhes de aeronave");
      console.log("4. Gerar relatório de entrega");
      console.log("0. Voltar");

      const opcao = rl.question("\nOpção: ").trim();

      switch (opcao) {
        case "1": this.cadastrar(); break;
        case "2": this.aeronaveService.listarTodas(); break;
        case "3": this.exibirDetalhes(); break;
        case "4": this.gerarRelatorio(); break;
        case "0": continuar = false; break;
        default: console.log("\n[AVISO] Opcao inválida.");
      }
    }
  }

  private cadastrar(): void {
    if (!this.authService.exigirPermissao(NivelPermissao.ADMINISTRADOR)) return;

    console.log("\n--- Cadastro de Aeronave ---");
    const codigo = rl.question("Código (único) : ").trim();
    const modelo = rl.question("Modelo         : ").trim();

    const tipos = Object.values(TipoAeronave);
    tipos.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
    const idx = rl.questionInt("Tipo (número)  : ") - 1;
    if (idx < 0 || idx >= tipos.length) { console.log("\n[ERRO] Tipo inválido."); return; }

    const capacidade = rl.questionInt("Capacidade (pax): ");
    const alcance = rl.questionInt("Alcance (km)    : ");

    this.aeronaveService.cadastrar(codigo, modelo, tipos[idx], capacidade, alcance);
  }

  private exibirDetalhes(): void {
    this.aeronaveService.listarTodas();
    const codigo = rl.question("\nCódigo da aeronave: ").trim();
    const aeronave = this.aeronaveService.buscarPorCodigo(codigo);
    if (!aeronave) {
      console.log("\n[ERRO] Aeronave não encontrada.");
      return;
    }
    aeronave.exibirDetalhes();
  }

  private gerarRelatorio(): void {
    if (!this.authService.exigirPermissao(NivelPermissao.ADMINISTRADOR)) return;

    this.aeronaveService.listarTodas();
    const codigo = rl.question("\nCódigo da aeronave: ").trim();
    const aeronave = this.aeronaveService.buscarPorCodigo(codigo);
    if (!aeronave) {
      console.log("\n[ERRO] Aeronave não encontrada.");
      return;
    }

    const nomeCliente = rl.question("Nome do cliente    : ").trim();
    const dataEntrega = rl.question("Data de entrega (dd/mm/aaaa): ").trim();

    this.relatorioService.gerar(aeronave, nomeCliente, dataEntrega);
  }
}