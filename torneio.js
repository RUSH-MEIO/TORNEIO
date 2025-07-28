const { clear } = require("console");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
let torneios = [];

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
        console.log(torneios);
        break;
      case 3:
        filtrarTorneios();
        break;
      case 4:
        deletarTorneios();
        break;
      case 5:
        registrapartidas();
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

function pergunta(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function adicionarTorneios() {
  console.clear();
  console.log("==== 🏆 TORNEIO 🏆 ===");

  const INPTorneioNome = await pergunta(
    "📋 Qual será o nome do torneio que deseja criar?: "
  );
  const INPTorneioJogoNome = await pergunta("🎮 Qual será o jogo disputado?: ");
  const INPTorneioData = await adicionarData();
  const INPTorneioPlayers = await pergunta(
    "👤 Quais serão os participantes? (Separe por virgula ex player1,player2,player3): "
  );
  adicionarTorneiosArray(
    INPTorneioNome,
    INPTorneioJogoNome,
    INPTorneioData,
    INPTorneioPlayers
  );
}

async function adicionarData() {
  let dia, mes, ano;
  let dataValida = false;
  let timestamp;

  while (!dataValida) {
    dia = await pergunta("📅 Insira o DIA do torneio (DD): ");
    mes = await pergunta("📅 Insira o MES do torneio (MM): ");
    ano = await pergunta("📅 Insira o ANO do torneio (AAAA): ");

    const numDia = parseInt(dia, 10);
    const numMes = parseInt(mes, 10);
    const numAno = parseInt(ano, 10);
    const dataObjeto = new Date(numAno, numMes - 1, numDia);
    if (
      !isNaN(dataObjeto.getTime()) &&
      dataObjeto.getDate() === numDia &&
      dataObjeto.getMonth() === numMes - 1 &&
      dataObjeto.getFullYear() === numAno
    ) {
      timestamp = dataObjeto.getTime();
      dataValida = true;
      //console.log(`Data válida! Timestamp gerado: ${timestamp}`);
    } else {
      console.log("⚠️ Data inválida. Por favor, insira uma data válida.");
    }
  }
  return timestamp;
}

function adicionarTorneiosArray(nome, jogo, timestampID, playersString) {
  const DataFormatada = new Date(timestampID).toLocaleString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const IDTORNEIO = Date.now();
  const playersarray = playersString.split(",").map((player) => player.trim());

  torneios.push({
    id: IDTORNEIO,
    nome: nome,
    jogo: jogo,
    data: DataFormatada,
    participantes: playersarray,
  });
  exibirMenu();
}

exibirMenu();

function registrarPartidas() {
  torneios.forEach((ID, nome) => {
    console.log(`${ID}- ${nome}`);
  });
  rl.question(
    "Insira qual torneio deseja registrar uma partida (ID):\n",
    (idTorneio) => {
      if (torneios.ID.includes(idTorneio)) {
        const torneioSelecionado = adicionarJogador1(); //torneio que tem o ID escolhido;
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
