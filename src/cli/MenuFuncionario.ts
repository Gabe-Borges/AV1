import * as rl from "readline-sync";
import { FuncionarioService } from "../services/FuncionarioService";
import { AuthService } from "../services/AuthService";
import { NivelPermissao } from "../enums/NivelPermissao";

export class MenuFuncionario {
  constructor(
    private funcionarioService: FuncionarioService,
    private authService: AuthService
  ) {}

  exibir(): void {
    let continuar = true;
    while (continuar) {
      console.log("\n===== GESTÃO DE FUNCIONÁRIOS =====");
      console.log("1. Cadastrar funcionário");
      console.log("2. Listar funcionários");
      console.log("3. Buscar por ID");
      console.log("0. Voltar");

      const opcao = rl.question("\nOpção: ").trim();

      switch (opcao) {
        case "1": this.cadastrar(); break;
        case "2": this.funcionarioService.listarTodos(); break;
        case "3": this.buscarPorId(); break;
        case "0": continuar = false; break;
        default: console.log("\n[AVISO] Opção inválida.");
      }
    }
  }

  private cadastrar(): void {
    if (!this.authService.exigirPermissao(NivelPermissao.ADMINISTRADOR)) return;

    console.log("\n--- Cadastro de Funcionário ---");
    const nome = rl.question("Nome          : ").trim();
    const telefone = rl.question("Telefone      : ").trim();
    const endereco = rl.question("Endereço      : ").trim();
    const usuario = rl.question("Usuário       : ").trim();
    const senha = rl.question("Senha         : ", { hideEchoBack: true }).trim();

    console.log("\nNível de permissão:");
    const niveis = Object.values(NivelPermissao);
    niveis.forEach((n, i) => console.log(`  ${i + 1}. ${n}`));
    const idx = rl.questionInt("Escolha (número): ") - 1;

    if (idx < 0 || idx >= niveis.length) {
      console.log("\n[ERRO] Nível inválido.");
      return;
    }

    this.funcionarioService.cadastrar(nome, telefone, endereco, usuario, senha, niveis[idx]);
  }

  private buscarPorId(): void {
    const id = rl.question("\nID do funcionário: ").trim();
    const f = this.funcionarioService.buscarPorId(id);
    if (!f) {
      console.log("\n[ERRO] Funcionário não encontrado.");
      return;
    }
    console.log("\n--- Detalhes ---");
    f.exibirDetalhes();
  }
}