const { clear } = require("console");
const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

// let torneios = []
//     let torneio = {
//         ID,
//         NOME,
//         JOGO,
//         DATA,
//         PARTICIPANTES : []
//         PARTIDA : []
// }


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
          break;
        case 0:
          process.exit();
        default:
          console.log("Insira uma opção válida!\n");
          exibirMenu();
      }
    });
}
exibirMenu()

function listarTorneios(){
if (torneios.length == 0){
    console.clear()
    console.log('Não ha torneios registrados!!')
}else {
    console.clear()
    console.log('========TORNEIOS========')
    torneios.forEach((torneio) => {
        console.log(
          `ID: ${torneio.id} | Nome: ${torneio.nome} | Jogo: ${torneio.jogo}  | Data: ${torneio.data}`
        )       
      })
      if (torneio.participantes && Array.isArray(torneio.participantes) && torneio.participantes.length > 0) {
        console.log('  --- Participante(s) deste Torneio ---');
        torneio.participantes.forEach((participante) => {
          console.log(`  - ${participante}`);
        });
      } else {
        console.log('--\nNenhum participante registrado nesse torneio--');
      }
      console.log('------------------------------------\n');
    };
      exibirMenu()
}

function ListarPartidasDoTorneio(){
    console.clear()
    if (torneio.partidas && Array.isArray(torneio.partidas) && torneio.partidas.length > 0) {
        console.log('  --- Partidas deste Torneio ---');
        torneio.participantes.forEach((partida) => {
          console.log(`  - ${partida}`);
        });
      } else {
        console.log('\nNenhuma partida registrada!!');
      }
      console.log('------------------------------------\n');
      exibirMenu()
    };
    