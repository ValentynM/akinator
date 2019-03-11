document.querySelector('main .start button').addEventListener('click', startAkinatorsWork);
const startDiv = document.querySelector('main .start');
const questionDiv = document.querySelector('main .question');
const answerDiv = document.querySelector('main .answer');
const playersList = document.querySelector('main .players');

players = [];

function startAkinatorsWork(event) {
    startDiv.hidden = true;
    ajaxGetPlayers();
    questionDiv.hidden = false;
    createQuestionDiv();
    createAkinatorQuestions();
}

function ajaxGetPlayers() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const playersData = JSON.parse(xhr.responseText);
            playersData['players'].map(getPlayerData);
            players = playersData['players'];
        }
    };
    xhr.open('GET', 'players.json', false);
    xhr.send();
}

function getPlayerData(player) {
    const playersDiv = document.createElement('div');
    playersDiv.className = "player";
    playersList.appendChild(playersDiv);
    const playerPhoto = document.createElement('img');
    playerPhoto.src = player.photo;
    playerPhoto.alt = player.player;
    playersDiv.appendChild(playerPhoto);
    const playerInfo = document.createElement('div');
    playerInfo.className = "player-info";
    playersDiv.appendChild(playerInfo);
    const playerNameSurname = document.createElement('p');
    playerNameSurname.textContent = player.player;
    playerInfo.appendChild(playerNameSurname);
    const playerChampionship = document.createElement('p');
    playerChampionship.textContent = player.championship;
    playerInfo.appendChild(playerChampionship);
    const playerClub = document.createElement('p');
    playerClub.textContent = player.club;
    playerInfo.appendChild(playerClub);
    const playerCountry = document.createElement('p');
    playerCountry.textContent = player.country;
    playerInfo.appendChild(playerCountry);
}

function createQuestionDiv() {
    const question = document.createElement('h2');
    questionDiv.appendChild(question);
    const btnDiv = document.createElement('div');
    questionDiv.appendChild(btnDiv);
    const yesButton = document.createElement('button');
    yesButton.className = 'yes-btn';
    yesButton.textContent = 'Yes';
    btnDiv.appendChild(yesButton);
    const noButton = document.createElement('button');
    noButton.className = 'no-btn';
    noButton.textContent = 'No';
    btnDiv.appendChild(noButton);
}

let tags;
let question;
let tag;

function createAkinatorQuestions() {
    const categories = ['championship', 'club', 'country', 'player'];
    tags = { 'championship': new Set(), 'club': new Set(), 'country': new Set(), 'player': new Set() };
    players.map(function(element) {
        for (let i = 0; i < categories.length; i++) {
            tags[categories[i]].add(element[categories[i]]);
        }
    });

    for (let i = 0; i < categories.length; i++) {
        if (tags[categories[i]].size > 1) {
            tag = categories[i];
            question = [...tags[tag]][Math.floor(Math.random() * tags[tag].size)];
            document.querySelector('main .question h2').textContent = tag === 'player' ? `Is it ${question}?` : `Is he from ${question}?`;
            break;
        }
    }

    if (tags['player'].size === 1) {
        getAnswer();
    }
}

$(document).on('click', '.yes-btn, .no-btn', playersFilter);

function playersFilter() {
    if (event.target.classList.contains('yes-btn')) {
        players = players.filter(el => el[tag] === question);
    }
    else if (event.target.classList.contains('no-btn')) {
        players = players.filter(el => !(el[tag] === question));
    }
    deleteChildNodes(playersList);
    players.map(getPlayerData);
    createAkinatorQuestions();
}

function deleteChildNodes(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

function getAnswer() {
    questionDiv.remove();
    const answer = document.createElement('h2');
    answer.textContent = `I think your football player is ${players[0].player}!`;
    answerDiv.appendChild(answer);
    const reloadBtn = document.createElement('button');
    reloadBtn.textContent = "Return to homepage";
    reloadBtn.className = "reload-btn";
    answerDiv.appendChild(reloadBtn);
}

$(document).on('click', '.reload-btn', function() { window.location.reload(); });
