import { TipoTeste } from "../enums/TipoTeste";
import { ResultadoTeste } from "../enums/ResultadoTeste";

export class Teste {
  tipo: TipoTeste;
  resultado: ResultadoTeste;

  constructor(tipo: TipoTeste, resultado: ResultadoTeste) {
    this.tipo = tipo;
    this.resultado = resultado;
  }

  exibirDetalhes(): void {
    const icone = this.resultado === ResultadoTeste.APROVADO ? "[OK]" : "[REPROVADO]";
    console.log(`  Tipo     : ${this.tipo}  ${icone} ${this.resultado}`);
  }

  serializar(): string {
    return `${this.tipo}|${this.resultado}`;
  }

  static desserializar(linha: string): Teste {
    const [tipo, resultado] = linha.split("|");
    return new Teste(tipo as TipoTeste, resultado as ResultadoTeste);
  }
}