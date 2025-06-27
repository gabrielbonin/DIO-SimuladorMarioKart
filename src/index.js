const player1 = {
  NOME: 'MARIO',
  VELOCIDADE: 4,
  MANOBRABILIDADE: 3,
  PODER: 4,
  PONTOS: 0,
  GIF_URL: 'mario.gif',
}
const player2 = {
  NOME: 'PEACH',
  VELOCIDADE: 3,
  MANOBRABILIDADE: 4,
  PODER: 2,
  PONTOS: 0,
  GIF_URL: 'peach.gif',
}
const player3 = {
  NOME: 'YOSHI',
  VELOCIDADE: 2,
  MANOBRABILIDADE: 4,
  PODER: 3,
  PONTOS: 0,
  GIF_URL: 'yoshi.gif',
}
const player4 = {
  NOME: 'BOWSER',
  VELOCIDADE: 5,
  MANOBRABILIDADE: 2,
  PODER: 5,
  PONTOS: 0,
  GIF_URL: 'bowser.gif',
}
const player5 = {
  NOME: 'DONKEY KONG',
  VELOCIDADE: 2,
  MANOBRABILIDADE: 2,
  PODER: 5,
  PONTOS: 0,
  GIF_URL: 'dk.gif',
}
const player6 = {
  NOME: 'LUIGI',
  VELOCIDADE: 3,
  MANOBRABILIDADE: 4,
  PODER: 4,
  PONTOS: 0,
  GIF_URL: 'luigi.gif',
}


async function rollDice() {
  return  Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = 'RETA'
      break;
     case random < 0.66:
      result = 'CURVA'
      break;
    default: 
      result = 'CONFRONTO'
  }

  return result
}


async function logRollResult(charName, block, diceRiceResult, attribute){
  console.log(`${charName} rolou um dado de ${block} ${diceRiceResult} + ${attribute} = ${diceRiceResult + attribute} \n`);
}

async function playRaceEngine(char1, char2){

  for (let round = 1; round <=5; round++){
  
    let block = await getRandomBlock();


    let diceRiceResult = await rollDice();
    let diceRiceResult2 = await rollDice();

    let totalSkill = 0;
    let totalSkill2 = 0;

    if(block === 'RETA'){
      totalSkill = diceRiceResult + char1.VELOCIDADE
      totalSkill2 = diceRiceResult2 + char2.VELOCIDADE

      await showRoundResultModal(char1, char2, block, diceRiceResult, diceRiceResult2, totalSkill, totalSkill2);
    }
    if(block === 'CURVA'){
      totalSkill = diceRiceResult + char1.MANOBRABILIDADE
      totalSkill2 = diceRiceResult2 + char2.MANOBRABILIDADE

      await showRoundResultModal(char1, char2, block, diceRiceResult, diceRiceResult2, totalSkill, totalSkill2);
    }
  if (block === 'CONFRONTO') {
  let powerResult = diceRiceResult + char1.PODER;
  let powerResult2 = diceRiceResult2 + char2.PODER;

  console.log(`${char1.NOME} confrontou ${char2.NOME} \n`);

  await logRollResult(char1.NOME, block, powerResult, char1.PODER);
  await logRollResult(char2.NOME, block, powerResult2, char2.PODER);

  // Mostra o modal com o resultado do confronto
  await showRoundResultModal(char1, char2, block, diceRiceResult, diceRiceResult2, powerResult, powerResult2);

  // Só altera os pontos DEPOIS que o usuário fechar o modal
  if (powerResult > powerResult2 && char2.PONTOS > 0) {
    char2.PONTOS--;
    console.log(`${char1.NOME} venceu o confronto! \n`);
  } else if (powerResult2 > powerResult && char1.PONTOS > 0) {
    char1.PONTOS--;
    console.log(`${char2.NOME} venceu o confronto! \n`);
  }

  // pular a parte de pontos normais do final do for
  continue;
}


  if (block !== 'CONFRONTO') {
  if (totalSkill > totalSkill2) {
    console.log(`${char1.NOME} marcou um ponto! \n`);
    char1.PONTOS++;
  } else {
    console.log(`${char2.NOME} marcou um ponto! \n`);
    char2.PONTOS++;
  }
}


  }
}

async function showRoundResultModal(char1, char2, block, dice1, dice2, total1, total2) {
  return new Promise(resolve => {
    const modal = document.getElementById('round-result-modal');
    const body = document.getElementById('round-result-body');
    const closeBtn = document.getElementById('close-round-modal');

    const atributo = block === 'RETA' ? 'VELOCIDADE' : block === 'CURVA' ? 'MANOBRABILIDADE' : 'PODER';

    const getLine = (char, dice, total) =>
      `<p><strong>${char.NOME}</strong>: 🎲 <span class="dado">${dice}</span> + <span class="atributo">${char[atributo]}</span> (<span class="nome-atributo">${atributo}</span>) = <span class="total">${total}</span></p>`;

    body.innerHTML = `
      <p><strong>Bloco:</strong> ${block}</p>
      ${getLine(char1, dice1, total1)}
      ${getLine(char2, dice2, total2)}
      <p><strong>${total1 > total2 ? char1.NOME : total2 > total1 ? char2.NOME : 'Empate'} venceu a rodada!</strong></p>
    `;

    modal.classList.remove('hidden');

    closeBtn.onclick = () => {
      modal.classList.add('hidden');
      resolve(); // 🔥 resolve a promise só quando o usuário clicar em fechar
    };
  });
}



async function declareWinner(char1, char2) {
  const modal = document.getElementById('winner-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImageContainer = document.getElementById('modal-image-container');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const closeModal = document.getElementById('close-modal');



  modalImageContainer.innerHTML = ''; // limpa antes de adicionar

  if (char1.PONTOS > char2.PONTOS) {
    modalTitle.textContent = `${char1.NOME} venceu! 🏁`;
    modalSubtitle.textContent = `${char1.NOME} dominou a corrida!`;

    const img = document.createElement('img');
    img.src = char1.GIF_URL;
    img.alt = char1.NOME;
    modalImageContainer.appendChild(img);
  } else if (char2.PONTOS > char1.PONTOS) {
    modalTitle.textContent = `${char2.NOME} venceu! 🏁`;
    modalSubtitle.textContent = `${char2.NOME} mostrou quem manda na pista!`;

    const img = document.createElement('img');
    img.src = char2.GIF_URL;
    img.alt = char2.NOME;
    modalImageContainer.appendChild(img);
  } else {
    modalTitle.textContent = 'Empate!';
    modalSubtitle.textContent = 'Foi uma disputa acirrada!';

    const img1 = document.createElement('img');
    img1.src = char1.GIF_URL;
    img1.alt = char1.NOME;

    const img2 = document.createElement('img');
    img2.src = char2.GIF_URL;
    img2.alt = char2.NOME;

    modalImageContainer.appendChild(img1);
    modalImageContainer.appendChild(img2);
  }

  modal.classList.remove('hidden');

  closeModal.onclick = () => modal.classList.add('hidden');
}


const players = [player1, player2, player3, player4, player5, player6]

function renderCharacters(players, containerId, onSelect, classeExtra = '') {
  const track = document.getElementById(containerId);
  track.innerHTML = '';

  players.forEach((player) => {
    const container = document.createElement('div');
    container.className = 'card-personagem';

    const img = document.createElement('img');
    img.src = player.GIF_URL;
    img.alt = player.NOME;
    img.className = 'personagem';
    img.dataset.nome = player.NOME;

    const nome = document.createElement('p');
    nome.textContent = player.NOME;
    nome.className = 'personagem-nome';

    const stats = document.createElement('ul');
    stats.className = 'atributos';
    stats.innerHTML = `
      <li>Velocidade: ${player.VELOCIDADE}</li>
      <li>Manobrabilidade: ${player.MANOBRABILIDADE}</li>
      <li>Poder: ${player.PODER}</li>
    `;

    img.addEventListener('click', () => {
      track.querySelectorAll('.personagem').forEach(p => {
        p.classList.remove('selecionado', 'inimigo');
      });

      img.classList.add('selecionado');
      if (classeExtra) img.classList.add(classeExtra);

      if (onSelect) onSelect(player);
    });

    container.appendChild(img);
    container.appendChild(nome);
    container.appendChild(stats);

    track.appendChild(container);
  });
}

const volumeBtn = document.getElementById('volume-btn');
let themeAudio = null;
let isPlaying = false;

volumeBtn.addEventListener('click', () => {
  if (!themeAudio) {
    themeAudio = new Audio('./theme.mp3');
    themeAudio.loop = true;
  }

  if (isPlaying) {
    themeAudio.pause();
    volumeBtn.textContent = '🔇 Pausar Música Tema Mario Kart';
  } else {
    themeAudio.play().catch((e) => {
      console.warn('Autoplay bloqueado:', e);
    });
    volumeBtn.textContent = '🔊 Música Tema Mario Kart';
  }

  isPlaying = !isPlaying;
});




(async function main(){

let jogadorSelecionado = null;
let inimigoSelecionado = null;

renderCharacters(players, 'player-select', (player) => {
  jogadorSelecionado = player;
  console.log('Jogador escolhido:', player.NOME);
}, '');

renderCharacters(players, 'enemy-select', (player) => {
  inimigoSelecionado = player;
  console.log('Inimigo escolhido:', player.NOME);
}, 'inimigo'); 

const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', async () => {
 
  if (!jogadorSelecionado || !inimigoSelecionado) {
    alert('Escolha um personagem e um inimigo antes de começar!');
    return;
  }

  if (!themeAudio) {
    themeAudio = new Audio('./theme.mp3');
    themeAudio.loop = true;
  }
  if (!isPlaying) {
    try {
      await themeAudio.play();
      volumeBtn.textContent = '🔊 Música Tema Mario Kart';
      isPlaying = true;
    } catch (e) {
      console.warn('Erro ao tentar tocar a música:', e);
    }
  }

 
  jogadorSelecionado.PONTOS = 0;
  inimigoSelecionado.PONTOS = 0;

  console.clear();
  console.log(`Corrida entre ${jogadorSelecionado.NOME} e ${inimigoSelecionado.NOME} vai começar!\n`);

  await playRaceEngine(jogadorSelecionado, inimigoSelecionado);
  await declareWinner(jogadorSelecionado, inimigoSelecionado);
});

}())