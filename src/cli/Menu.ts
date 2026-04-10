import * as rl from "readline-sync";
import { AuthService } from "../services/AuthService";
import { AeronaveService } from "../services/AeronaveService";
import { FuncionarioService } from "../services/FuncionarioService";
import { PecaService } from "../services/PecaService";
import { EtapaService } from "../services/EtapaService";
import { TesteService } from "../services/TesteService";
import { RelatorioService } from "../services/RelatorioService";
import { MenuAeronave } from "./MenuAeronave";
import { MenuFuncionario } from "./MenuFuncionario";
import { MenuPeca } from "./MenuPeca";
import { MenuEtapa } from "./MenuEtapa";
import { MenuTeste } from "./MenuTeste";

export class Menu {
  private authService: AuthService;
  private aeronaveService: AeronaveService;
  private funcionarioService: FuncionarioService;
  private pecaService: PecaService;
  private etapaService: EtapaService;
  private testeService: TesteService;
  private relatorioService: RelatorioService;

  private menuAeronave: MenuAeronave;
  private menuFuncionario: MenuFuncionario;
  private menuPeca: MenuPeca;
  private menuEtapa: MenuEtapa;
  private menuTeste: MenuTeste;

  constructor(
    authService: AuthService,
    aeronaveService: AeronaveService,
    funcionarioService: FuncionarioService
  ) {
    this.authService = authService;
    this.aeronaveService = aeronaveService;
    this.funcionarioService = funcionarioService;
    this.pecaService = new PecaService();
    this.etapaService = new EtapaService();
    this.testeService = new TesteService();
    this.relatorioService = new RelatorioService();

    this.menuAeronave = new MenuAeronave(this.aeronaveService, this.relatorioService, this.authService);
    this.menuFuncionario = new MenuFuncionario(this.funcionarioService, this.authService);
    this.menuPeca = new MenuPeca(this.pecaService, this.aeronaveService, this.authService);
    this.menuEtapa = new MenuEtapa(this.etapaService, this.aeronaveService, this.funcionarioService, this.authService);
    this.menuTeste = new MenuTeste(this.testeService, this.aeronaveService, this.authService);
  }

  iniciar(): void {
    this.exibirBanner();
    this.fazerLogin();
    this.loopPrincipal();
  }

  private exibirBanner(): void {
    console.log("\n");
    console.log("  ╔══════════════════════════════════════╗");
    console.log("  ║              AEROCODE                ║");
    console.log("  ║  Gestão de Produção de Aeronaves     ║");
    console.log("  ╚══════════════════════════════════════╝");
    console.log("\n");
  }

  private fazerLogin(): void {
    let logado = false;
    while (!logado) {
      console.log("=== LOGIN ===");
      const usuario = rl.question("Usuário: ").trim();
      const senha = rl.question("Senha  : ", { hideEchoBack: true }).trim();
      logado = this.authService.login(this.funcionarioService.getFuncionarios(), usuario, senha);
      if (!logado) {
        console.log("Tente novamente.\n");
      }
    }
  }

  private loopPrincipal(): void {
    let continuar = true;
    while (continuar) {
      const f = this.authService.getFuncionarioLogado();
      console.log(`\n=== MENU PRINCIPAL [${f?.nivelPermissao}] ===`);
      console.log("1. Aeronaves");
      console.log("2. Peças");
      console.log("3. Etapas de produção");
      console.log("4. Testes");
      console.log("5. Funcionários");
      console.log("9. Logout");
      console.log("0. Sair");

      const opcao = rl.question("\nOpção: ").trim();

      switch (opcao) {
        case "1": this.menuAeronave.exibir(); break;
        case "2": this.menuPeca.exibir(); break;
        case "3": this.menuEtapa.exibir(); break;
        case "4": this.menuTeste.exibir(); break;
        case "5": this.menuFuncionario.exibir(); break;
        case "9":
          this.authService.logout();
          this.fazerLogin();
          break;
        case "0":
          console.log("\nEncerrando.\n");
          continuar = false;
          break;
        default:
          console.log("\n[AVISO] Opção inválida.");
      }
    }
  }
}
"Python é legal!"