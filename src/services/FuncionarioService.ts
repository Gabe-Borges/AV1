import { Funcionario } from "../models/Funcionario";
import { NivelPermissao } from "../enums/NivelPermissao";
import { salvarFuncionarios } from "../persistence/DataLoader";

export class FuncionarioService {
  private funcionarios: Funcionario[];

  constructor(funcionarios: Funcionario[]) {
    this.funcionarios = funcionarios;
  }

  cadastrar(
    nome: string,
    telefone: string,
    endereco: string,
    usuario: string,
    senha: string,
    nivelPermissao: NivelPermissao
  ): Funcionario | null {
    if (this.funcionarios.some(f => f.usuario === usuario)) {
      console.log(`\n[ERRO] Já existe um funcionário com o usuário "${usuario}".`);
      return null;
    }
    const id = `F${Date.now()}`;
    const novo = new Funcionario(id, nome, telefone, endereco, usuario, senha, nivelPermissao);
    this.funcionarios.push(novo);
    salvarFuncionarios(this.funcionarios);
    console.log(`\nFuncionário "${nome}" cadastrado com sucesso. ID: ${id}`);
    return novo;
  }

  buscarPorId(id: string): Funcionario | null {
    return this.funcionarios.find(f => f.id === id) ?? null;
  }

  buscarPorUsuario(usuario: string): Funcionario | null {
    return this.funcionarios.find(f => f.usuario === usuario) ?? null;
  }

  listarTodos(): void {
    if (this.funcionarios.length === 0) {
      console.log("\nNenhum funcionário cadastrado.");
      return;
    }
    console.log("\n========== FUNCIONÁRIOS CADASTRADOS ==========");
    this.funcionarios.forEach((f, i) => {
      console.log(`  ${i + 1}. [${f.id}] ${f.nome} | @${f.usuario} | ${f.nivelPermissao}`);
    });
    console.log("==============================================");
  }

  getFuncionarios(): Funcionario[] {
    return this.funcionarios;
  }
}