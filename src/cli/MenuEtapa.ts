import * as rl from "readline-sync";
import { EtapaService } from "../services/EtapaService";
import { AeronaveService } from "../services/AeronaveService";
import { FuncionarioService } from "../services/FuncionarioService";
import { AuthService } from "../services/AuthService";
import { NivelPermissao } from "../enums/NivelPermissao";
import { Aeronave } from "../models/Aeronave";

export class MenuEtapa {
  constructor(
    private etapaService: EtapaService,
    private aeronaveService: AeronaveService,
    private funcionarioService: FuncionarioService,
    private authService: AuthService
  ) {}

  exibir(): void {
    let continuar = true;
    while (continuar) {
      console.log("\n===== GESTÃO DE ETAPAS =====");
      console.log("1. Adicionar etapa");
      console.log("2. Listar etapas");
      console.log("3. Iniciar etapa");
      console.log("4. Finalizar etapa");
      console.log("5. Associar funcionário a etapa");
      console.log("0. Voltar");

      const opcao = rl.question("\nOpcao: ").trim();

      switch (opcao) {
        case "1": this.adicionar(); break;
        case "2": this.listar(); break;
        case "3": this.iniciar(); break;
        case "4": this.finalizar(); break;
        case "5": this.associarFuncionario(); break;
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

    console.log("\n--- Cadastro de Etapa ---");
    const nome = rl.question("Nome da etapa : ").trim();
    const prazo = rl.question("Prazo (dd/mm/aaaa): ").trim();

    this.etapaService.adicionar(aeronave, nome, prazo, this.funcionarioService.getFuncionarios());
  }

  private listar(): void {
    const aeronave = this.selecionarAeronave();
    if (!aeronave) return;
    this.etapaService.listar(aeronave);
  }

  private iniciar(): void {
    if (!this.authService.exigirPermissao(NivelPermissao.ENGENHEIRO)) return;

    const aeronave = this.selecionarAeronave();
    if (!aeronave) return;

    this.etapaService.listar(aeronave);
    if (aeronave.etapas.length === 0) return;

    const indice = rl.questionInt("\nNúmero da etapa: ") - 1;
    this.etapaService.iniciar(aeronave, indice, this.funcionarioService.getFuncionarios());
  }

  private finalizar(): void {
    if (!this.authService.exigirPermissao(NivelPermissao.ENGENHEIRO)) return;

    const aeronave = this.selecionarAeronave();
    if (!aeronave) return;

    this.etapaService.listar(aeronave);
    if (aeronave.etapas.length === 0) return;

    const indice = rl.questionInt("\nNúmero da etapa: ") - 1;
    this.etapaService.finalizar(aeronave, indice, this.funcionarioService.getFuncionarios());
  }

  private associarFuncionario(): void {
    if (!this.authService.exigirPermissao(NivelPermissao.ENGENHEIRO)) return;

    const aeronave = this.selecionarAeronave();
    if (!aeronave) return;

    this.etapaService.listar(aeronave);
    if (aeronave.etapas.length === 0) return;
    const indiceEtapa = rl.questionInt("\nNúmero da etapa: ") - 1;

    this.funcionarioService.listarTodos();
    const id = rl.question("\nID do funcionário: ").trim();
    const funcionario = this.funcionarioService.buscarPorId(id);
    if (!funcionario) {
      console.log("\n[ERRO] Funcionário não encontrado.");
      return;
    }

    this.etapaService.associarFuncionario(
      aeronave,
      indiceEtapa,
      funcionario,
      this.funcionarioService.getFuncionarios()
    );
  }
}