const { clear } = require("console");
const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

function exibirMenu() {
    console.log(
      "=========MENU=========\n1-Adicionar Torneio\n2-Listar Torneios\n3-Filtrar Torneio\n4-Deletar Torneios\n5-Registrar Partidas\n6-Listar Partidas de um Torneio\n0-Sair do programa"
    );
    rl.question("Insira a opção desejada.\n", (opcaoMenu) => {
      opcaoMenu = parseInt(opcaoMenu, 10);
      switch (opcaoMenu) {
        case 1:
          adicionarTorneios();
          break;
        case 2:
          listarTorneios();
          break;
        case 3:
          filtrarTorneios();
          break;
        case 4:
          deletarTorneios();
          break;
        case 5:
          registrapartidas()
          break;
        case 6:
          ListarPartidasDoTorneio()
        case 0:
          process.exit();
        default:
          console.log("Insira uma opção válida!\n");
          exibirMenu();
      }
    });
}