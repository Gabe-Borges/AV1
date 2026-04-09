import { AuthService } from "./services/AuthService";
import { AeronaveService } from "./services/AeronaveService";
import { FuncionarioService } from "./services/FuncionarioService";
import { NivelPermissao } from "./enums/NivelPermissao";
import { Funcionario } from "./models/Funcionario";
import {
  carregarFuncionarios,
  carregarAeronaves,
  carregarTudo,
} from "./persistence/DataLoader";
import { Menu } from "./cli/Menu";

function criarAdminPadrao(funcionarios: Funcionario[]): Funcionario[] {
  const jaExiste = funcionarios.some(f => f.usuario === "admin");
  if (!jaExiste) {
    const admin = new Funcionario(
      "F0000000000000",
      "Administrador",
      "000000000",
      "Aerocode HQ",
      "admin",
      "admin123",
      NivelPermissao.ADMINISTRADOR
    );
    funcionarios.push(admin);
    console.log("\n[INFO] Usuário administrador padrão criado.");
    console.log("  Usuário: admin | Senha: admin123");
    console.log("  Altere a senha após o primeiro acesso.\n");
  }
  return funcionarios;
}

function main(): void {
  console.log("\nCarregando dados...");

  let funcionarios = carregarFuncionarios();
  funcionarios = criarAdminPadrao(funcionarios);

  let aeronaves = carregarAeronaves();
  carregarTudo(aeronaves, funcionarios);

  const authService = new AuthService();
  const aeronaveService = new AeronaveService(aeronaves);
  const funcionarioService = new FuncionarioService(funcionarios);

  const menu = new Menu(authService, aeronaveService, funcionarioService);
  menu.iniciar();
}

main();