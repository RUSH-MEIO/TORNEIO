const { clear } = require("console");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
let jogadores = [
  {
    jogador1,
    jogador2,
    vencedor,
  },
];
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
        registrarPartidas();
        break;
      case 6:
        ListarPartidasDoTorneio();
      case 0:
        process.exit();
      default:
        console.log("Insira uma opção válida!\n");
        exibirMenu();
    }
  });
}

function registrarPartidas() {
  torneios.forEach((ID, nome) => {
    console.log(`${ID}- ${nome}`);
  });
  rl.question(
    "Insira qual torneio deseja registrar uma partida (ID):\n",
    (idTorneio) => {
      if (torneios.ID.includes(idTorneio)) {
        const torneioSelecionado = //torneio que tem o ID escolhido;
        adicionarJogador1(); 
      } else {
        console.log("Insira um ID de um torneio valido!");
        registrarPartidas();
      }
    }
  );
}

function adicionarJogador1() {
  console.log("Participantes: ");
  torneioSelecionado.participantes.forEach((index, nome) => {
    console.log(`${index} - ${torneioSelecionado.participante}`);
  });
  rl.question(`Escolha um jogador: `, (jogadorUm) => {
    if (torneioSelecionado.participante.includes(jogadorUm)) {
      jogadores.jogador1 = jogadorUm;
      adicionarJogador2();
    } else {
      console.log("Escolha um jogador valido!");
      adicionarJogador1();
    }
  });
}

function adicionarJogador2() {
  rl.question(`Escolha um jogador: `, (jogadorDois) => {
    if (torneioSelecionado.participante.includes(jogadorDois)) {
      jogadores.jogador2 = jogadorDois;
      escolherVencedor();
    } else {
      console.log("Escolha um jogador valido!");
      adicionarJogador2();
    }
  });
}

function escolherVencedor() {
  jogadores.forEach((index) => {
    console.log(`${index}-`);
  });
  rl.question("Insira quem venceu essa partida: \n", (definirVencedor) => {
    switch (definirVencedor) {
      case 1:
        break;
      case 2:
        break;
      default:
        console.log("Insira um jogador valido");
        escolherVencedor();
    }
  });
}
