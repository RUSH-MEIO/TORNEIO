const { clear } = require("console");
const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
let torneios = []

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
          listarTorneios()
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

function pergunta(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function adicionarTorneios(){
  console.clear();
  console.log("==== 🏆 TORNEIO 🏆 ===");

  const INPTorneioNome = await pergunta("📋 Qual será o nome do torneio que deseja criar?: ");
  const INPTorneioJogoNome = await pergunta("🎮 Qual será o jogo disputado?: ");
  const INPTorneioData = await adicionarData();
  const INPTorneioPlayers = await pergunta("👤 Quais serão os participantes? (Separe por virgula ex player1,player2,player3): ");
  adicionarTorneiosArray(INPTorneioNome, INPTorneioJogoNome, INPTorneioData, INPTorneioPlayers);
}

async function adicionarData(){
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
      dataObjeto.getMonth() === (numMes - 1) &&
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

function adicionarTorneiosArray(nome, jogo, timestampID, playersString){ 
    const DataFormatada = new Date(timestampID).toLocaleString('pt-BR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
    });

    const IDTORNEIO = Date.now();
    const playersarray = playersString.split(',').map(player => player.trim());
  
    const torneio = {
      id: IDTORNEIO,
      nome: nome,
      jogo: jogo,
      data: DataFormatada,
      participantes: playersarray
    };
    torneios.push(torneio)
    exibirMenu()
}

async function deletarTorneios(){
  const INPIDDelete = await pergunta("Digite o ID do TORNEIO que deseja deletar")
}

exibirMenu()

function listarTorneios() {
  if (torneios.length === 0) {
    console.clear();
    console.log('Não há torneios registrados!!');
  } else {
    console.clear();
    console.log('========TORNEIOS========');
    torneios.forEach((torneio) => {
      console.log(
        `ID: ${torneio.id} | Nome: ${torneio.nome} | Jogo: ${torneio.jogo}  | Data: ${torneio.data}`
      );
      if (torneio.participantes && Array.isArray(torneio.participantes) && torneio.participantes.length > 0) {
        console.log('  --- Participante(s) deste Torneio ---');
        torneio.participantes.forEach((participante) => {
          console.log(`  - ${participante}`);
        });
      } else {
        console.log('-- Nenhum participante registrado nesse torneio --');
      }
      console.log('------------------------------------\n');
    });
  }
  exibirMenu();
}

function ListarPartidasDoTorneio(){
    console.clear()
    if (torneios.partidas && Array.isArray(torneios.partidas) && torneios.partidas.length > 0) {
        console.log('  --- Partidas deste Torneio ---');
        torneios.participantes.forEach((partida) => {
          console.log(`  - ${partida}`);
        });
      } else {
        console.log('----------------------------\nNenhuma partida registrada!!');
      }
      console.log('----------------------------\n');
      exibirMenu()
    };
    