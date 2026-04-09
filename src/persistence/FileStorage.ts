import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function garantirDiretorio(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function salvarLinhas(arquivo: string, linhas: string[]): void {
  garantirDiretorio();
  const caminho = path.join(DATA_DIR, arquivo);
  fs.writeFileSync(caminho, linhas.join("\n"), "utf-8");
}

export function carregarLinhas(arquivo: string): string[] {
  garantirDiretorio();
  const caminho = path.join(DATA_DIR, arquivo);
  if (!fs.existsSync(caminho)) return [];
  const conteudo = fs.readFileSync(caminho, "utf-8").trim();
  if (!conteudo) return [];
  return conteudo.split("\n").filter(l => l.trim() !== "");
}

export function arquivoExiste(arquivo: string): boolean {
  return fs.existsSync(path.join(DATA_DIR, arquivo));
}