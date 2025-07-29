const { clear } = require("console");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
let torneios = [];
let partidas = [];

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
  console.clear();
  torneios.forEach((torneio) => {
    console.log(`${torneio.id} - ${torneio.nome}`);
  });
  rl.question(
    "Insira qual torneio deseja registrar uma partida (ID):\n",
    (idTorneio) => {
      const idTorneioNUM = parseInt(idTorneio, 10);
      const torneioSelecionado = torneios.find((t) => t.id == idTorneioNUM);

      if (!torneioSelecionado) {
        console.log("ID de torneio inválido!");
        exibirMenu();
        return;
      }
      let novaPartida = {
        // partidaId: Date.now(),
        torneioId: torneioSelecionado.id,
        torneioNome: torneioSelecionado.nome,
        jogador1: null,
        jogador2: null,
        vencedor: null,
      };
      adicionarJogador1(novaPartida, torneioSelecionado);
    }
  );
}

function adicionarJogador1(partida, torneio) {
  console.log("Participantes: ");
  torneio.participantes.forEach((nomeJogador, indice) => {
    console.log(`${indice + 1} - ${nomeJogador}`);
  });

  rl.question(`Escolha o jogador 1 (pelo numero): `, (jogadorUm) => {
    jogadorUm = parseInt(jogadorUm);
    const jogador1Selecionado = torneio.participantes[jogadorUm - 1];
    partida.jogador1 = jogador1Selecionado;

    adicionarJogador2(partida, torneio);
  });
}

function adicionarJogador2(partida, torneio) {
  const oponentes = torneio.participantes.filter((p) => p !== partida.jogador1);
  oponentes.forEach((nomeJogador, indice) => {
    console.log(`${indice + 1} - ${nomeJogador}`);
  });
  rl.question(`Escolha o jogador 2 (pelo numero): `, (jogadorDois) => {
    jogadorDois = parseInt(jogadorDois);
    const jogador2Selecionado = oponentes[jogadorDois - 1];
    partida.jogador2 = jogador2Selecionado;

    escolherVencedor(partida);
  });
}

function escolherVencedor(novaPartida) {
  console.log(`1- ${novaPartida.jogador1}`)
  console.log(`2- ${novaPartida.jogador2}`)
  rl.question("Insira quem venceu essa partida: \n", (definirVencedor) => {
    definirVencedor=parseInt(definirVencedor)
    switch (definirVencedor) {
      case 1:
        novaPartida.vencedor=novaPartida.jogador1
        final(novaPartida)
        break;
      case 2:
        novaPartida.vencedor=novaPartida.jogador2
        final(novaPartida)
        break;
      default:
        console.log("Insira um jogador valido");
        escolherVencedor(novaPartida);
    }
  });
}

function final(novaPartida){
  partidas.push(novaPartida)
  console.log(`O vencedo da partida entre '${novaPartida.jogador1}' x '${novaPartida.jogador2}' foi : ${novaPartida.vencedor} }`)
  exibirMenu()

}
