const { clear } = require("console");
const fs = require("fs");
const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
let torneios = []

const DBMASTER = 'torneios.json'

function salvarDados(nomeArquivo, dados, callback) {
  const jsonString = JSON.stringify(dados, null, 2);
  fs.writeFile(nomeArquivo, jsonString, (err) => {
      if (err) {
          console.log(`Erro ao salvar o arquivo '${nomeArquivo}':`, err);
      } else {
          //console.log(`Dados de '${nomeArquivo}' salvos com sucesso!`);
      }
      if (callback) callback();
  });
}

function carregarDados(nomeArquivo, callback) {
  fs.readFile(nomeArquivo, 'utf8', (err, data) => {
      if (err) {
          if (err.code === 'ENOENT') {
              console.log(`Arquivo '${nomeArquivo}' não encontrado. Iniciando com uma lista vazia.`);
              callback([]);
          } else {
              console.log(`Erro ao carregar o arquivo '${nomeArquivo}':`, err);
              callback([]);
          }
          return;
      }

      try {
          const dados = JSON.parse(data);
          console.log(`Dados de '${nomeArquivo}' carregados com sucesso.`);
          callback(dados);
      } catch (parseErr) {
          console.log(`Erro ao analisar o JSON do arquivo '${nomeArquivo}':`, parseErr);
          callback([]);
      }
  });
}

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
          console.log(torneios)
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
    salvarDados(DBMASTER, torneios, () => {
      console.clear()
      console.log(`========== Torneio criado com SUCESSO! ========== \nNome do Torneio: ${nome} | Jogo: ${jogo} | Data: ${DataFormatada} | Participantes: ${playersarray}`)
      rl.question("Pressione ENTER para Retornar", exibirMenu)
    })
}

async function deletarTorneios(){
  if(torneios.length < 1){
    rl.question("Não há torneios cadastrados, pressione ENTER para retornar", exibirMenu)
  } else {
    const INPIDDelete = await pergunta("Digite o ID do TORNEIO que deseja deletar")
  }
  
}

console.log("Iniciando o sistema...");
    carregarDados(DBMASTER, (dadostorneio) => {
        torneios = dadostorneio;
        exibirMenu();
    });