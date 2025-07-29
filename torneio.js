const { clear } = require("console");
const fs = require("fs");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
let torneios = [];
let partidas = [];

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
      "=========MENU=========\n1-Adicionar Torneio\n2-Listar Torneios\n3-Filtrar por Jogo\n4-Deletar Torneios\n5-Registrar Partidas\n6-Listar Partidas de um Torneio\n0-Sair do programa"
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
          registrarPartidas()
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
  console.clear()
  if(torneios.length <= 0){
    console.log('----------------------------\nNão há torneios registrados para serem deletados.');
    rl.question('Pressione Enter para retornar ao menu...', exibirMenu)
    return;
  }
  console.log('========TORNEIOS A SEREM DELETADOS========')
  torneios.forEach((torneio) => {
    console.log(`ID: ${torneio.id} || NOME: ${torneio.nome} | JOGO: ${torneio.jogo} | DATA: ${torneio.data} | JOGADORES: ${torneio.participantes}`)
  })
  console.log('==========================================\n')
  const INPIDDelete = await pergunta("Digite o timestamp (ID) do TORNEIO que deseja deletar\n")
  const idParaDeletar = parseInt(INPIDDelete, 10)
  if(isNaN(idParaDeletar)){
    console.log('Por favor, digite um ID válido.')
    exibirMenu();
    return;
  }
  const initialLength = torneios.length
  torneios = torneios.filter(torneio => torneio.id !== idParaDeletar);
  if (torneios.length < initialLength) {
    console.clear();
    console.log(`Torneio com ID ${idParaDeletar} deletado com sucesso!`);
  } else {
    console.clear();
    console.log(`Torneio com ID ${idParaDeletar} não encontrado.`);
  }
  salvarDados(DBMASTER, torneios, () => {
    rl.question("Pressione ENTER para Retornar", exibirMenu)
  })
}

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

function filtrarTorneios() {
  console.clear();
  rl.question("Por qual jogo você deseja filtrar?\n", (resposta) => {
    const jogosFiltrados = torneios.filter(
      (torneio) => torneio.jogo == resposta
    );
    if (jogosFiltrados.length > 0) {
      console.clear()
      resposta = resposta.toUpperCase()
      console.log(`===TORNEIOS COM O JOGO ${resposta}===`)
      jogosFiltrados.forEach((torneio, index) => {
        console.log(
          `ID: ${torneio.id} || Nome: ${torneio.nome} || Jogo: ${torneio.jogo} || Data: ${torneio.data} || Participantes: ${torneio.participantes}`
        );
      });
    } else {
      console.clear();
      console.log("Nenhum torneio com este jogo encontrado.");
    }
    exibirMenu()
  });
}

async function registrarPartidas(){
  console.clear();
  if (torneios.length === 0) {
      console.log('Não há torneios registrados para registrar partidas.');
      rl.question('Pressione Enter para retornar ao menu...', exibirMenu);
      return;
  }

  console.log('======== ESCOLHA UM TORNEIO PARA REGISTRAR PARTIDA ========');
  torneios.forEach((torneio) => {
      console.log(`ID: ${torneio.id} | Nome: ${torneio.nome} | Jogo: ${torneio.jogo}`);
  });
  console.log('===========================================================\n');

  const inputID = await pergunta("Digite o ID do torneio para registrar a partida: ");
  const idTorneio = parseInt(inputID, 10);

  const torneioIndex = torneios.findIndex(torneio => torneio.id === idTorneio);

  if (torneioIndex !== -1) {
      const torneioSelecionado = torneios[torneioIndex];
      console.clear();
      console.log(`Registrando partida para o torneio: ${torneioSelecionado.nome}`);

      const jogadoresPartidaInput = await pergunta("Quais jogadores participaram desta partida? (Separe por vírgula, ex: player1,player2): ");
      const jogadoresPartida = jogadoresPartidaInput.split(',').map(p => p.trim());

      // Validação básica para garantir que os jogadores da partida estão no torneio
      const jogadoresInvalidos = jogadoresPartida.filter(player => !torneioSelecionado.participantes.includes(player));
      if (jogadoresInvalidos.length > 0) {
          console.log(`Erro: Os seguintes jogadores não estão registrados neste torneio: ${jogadoresInvalidos.join(', ')}`);
          rl.question('Pressione Enter para retornar ao menu...', exibirMenu);
          return;
      }

      const vencedor = await pergunta("Quem foi o vencedor da partida?: ");
      if (!jogadoresPartida.includes(vencedor)) {
        console.log(`Erro: O vencedor "${vencedor}" não estava entre os jogadores da partida.`);
        rl.question('Pressione Enter para retornar ao menu...', exibirMenu);
        return;
      }

      const placar = await pergunta("Qual foi o placar da partida? (ex: 2-1): ");

      const dataPartida = new Date().toLocaleString('pt-BR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
      });

      const novaPartida = {
          jogadores: jogadoresPartida,
          vencedor: vencedor,
          placar: placar,
          data: dataPartida,
          id: Date.now() // ID único para a partida
      };

      if (!torneioSelecionado.partidas) {
          torneioSelecionado.partidas = [];
      }
      torneioSelecionado.partidas.push(novaPartida);
      salvarDados(DBMASTER, torneios, () => {
          console.clear();
          console.log('Partida registrada com sucesso!');
          console.log(`Torneio: ${torneioSelecionado.nome}`);
          console.log(`Jogadores: ${novaPartida.jogadores.join(' vs ')}`);
          console.log(`Vencedor: ${novaPartida.vencedor}`);
          console.log(`Placar: ${novaPartida.placar}`);
          console.log(`Data: ${novaPartida.data}`);
          rl.question("Pressione ENTER para Retornar", exibirMenu);
      });

  } else {
      console.clear();
      console.log('Torneio não encontrado com o ID fornecido.');
      rl.question('Pressione Enter para retornar ao menu...', exibirMenu);
  }
}

console.log("Iniciando o sistema...");
    carregarDados(DBMASTER, (dadostorneio) => {
        torneios = dadostorneio;
        exibirMenu();
    });
