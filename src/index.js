import './style.css';

const grab = (e) => document.getElementById(e);
const sub = grab('sub');
const refBtn = grab('ref-btn');
const ol = grab('list');

const refresh = async (gameID) => {
  await fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameID}/scores/`)
    .then((response) => {
      const res = response.json();
      res.then((finalResponse) => {
        const { result } = finalResponse;
        result.forEach((element) => {
          ol.innerHTML += `<li>${element.user}:${element.score}</li>`;
        });
      });
    })
    .catch((error) => { throw new Error(error); });
};

refBtn.addEventListener('click', async () => {
  const { result } = JSON.parse(localStorage.getItem('gameID') || '');
  const newID = result.slice(14, 34);
  if (newID !== null) {
    ol.innerHTML = ''; // clear out elements before calling the refresh
    refresh(newID);
  }
});

const init = async () => {
  if (localStorage.getItem('gameID') === null) {
    fetch('https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Formula1',
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem('gameID', JSON.stringify(data));
      });
  }

  sub.addEventListener('click', async (e) => {
    e.preventDefault();
    const inputData = {
      user: grab('name').value,
      score: grab('score').value,
    };

    grab('name').value = '';
    grab('score').value = '';
    const { result } = JSON.parse(localStorage.getItem('gameID') || '');
    const newID = result.slice(14, 34);

    await fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${newID}/scores/`, {
      method: 'POST',
      body: JSON.stringify(inputData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json());
  });
};

init();