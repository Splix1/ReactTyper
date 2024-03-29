import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import randomWords from '../../public/randomwords';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import socket from '../socket';

function SprintRace() {
  let [raceParagraph, setRaceParagraph] = useState([]);
  let [currentlyTyped, setCurrentlyTyped] = useState('');
  let [currentWord, setCurrentWord] = useState('');
  let [charactersTyped, setCharactersTyped] = useState(0);
  let [wordsTyped, setWordsTyped] = useState(0);
  let [WPM, setWPM] = useState(0);
  let [timer, setTimer] = useState(30);
  let [timeElapsed, setTimeElapsed] = useState(0);
  let [racing, setRacing] = useState(false);
  let [raceCompleted, setRaceCompleted] = useState(false);
  let [allWPMs, setallWPMs] = useState([]);
  let [averageWPM, setAverageWPM] = useState(0);
  let [wrongWords, setWrongWords] = useState([]);
  let [displayWrongWords, setDisplayWrongWords] = useState(false);
  let [results, setResults] = useState([]);
  let [raceId, setRaceId] = useState(0);
  let user = useSelector((state) => state.auth);
  let location = useLocation();
  let [players, setPlayers] = useState([]);
  let [countdown, setCountdown] = useState(3);
  let [countingDown, setCountingDown] = useState(false);
  let [countingDownPlayers, setCountingDownPlayers] = useState(false);

  useEffect(() => {
    let fetchingPlayers;
    if (raceId > 0 && racing === false && timer === 30) {
      fetchPlayers();
    }
    return function cleanup() {
      clearInterval(fetchingPlayers);
      // axios.delete('/api/scores/score', { userid: user.id, raceid: raceId });
    };
  }, [raceId, racing]);

  async function fetchPlayers() {
    let { data } = await axios.get('/api/scores/listofplayers', {
      headers: {
        raceid: raceId,
      },
    });
    let playerList = [];
    data.forEach((user) => {
      playerList.push(user.user.username);
    });
    setPlayers(playerList);
  }

  useEffect(() => {
    return function cleanup() {
      socket.emit('left-game', { name: user.username });
    };
  }, []);

  useEffect(() => {
    async function room() {
      let { data } = await axios.get('/api/scores/roommatch', {
        headers: {
          roomid: +location.search.split('=')[1],
        },
      });

      //if a match exists for this room
      if (data !== null) {
        if (!data.completed && !data.inProgress) {
          if (user.id) {
            let score = {
              WPM,
              userId: user.id,
              timeElapsed: 0,
              wordsTyped,
              mode: 'sprintrace',
              raceId: data.id,
            };
            let ifScoreExists = await axios.get('/api/scores/score', {
              headers: {
                userid: user.id,
                raceid: data.id,
              },
            });

            if (ifScoreExists.data === null) {
              await axios.post('/api/scores', score);
            }

            setRaceId(data.id);
            socket.emit('joined-race', {
              raceID: data.id,
              userID: user.id,
              name: user.username,
            });
          }
        } else {
          if (user.id) {
            let newRace = await axios.post('/api/scores/newrace', {
              roomID: +location.search.split('=')[1],
              completed: false,
              inProgress: false,
            });

            setRaceId(newRace.data.id);
            socket.emit('joined-race', {
              raceID: newRace.data.id,
              userID: user.id,
              name: user.username,
            });
            let score = {
              WPM,
              userId: user.id,
              timeElapsed: 0,
              wordsTyped,
              mode: 'sprintrace',
              raceId: newRace.data.id,
            };
            await axios.post('/api/scores', score);
          }
        }
      } else {
        if (user.id) {
          let newRace = await axios.post('/api/scores/newrace', {
            roomID: +location.search.split('=')[1],
            completed: false,
            inProgress: false,
          });

          setRaceId(newRace.data.id);
          socket.emit('joined-race', {
            raceID: newRace.data.id,
            userID: user.id,
            name: user.username,
          });
          let score = {
            WPM,
            userId: user.id,
            timeElapsed: 0,
            wordsTyped,
            mode: 'sprintrace',
            raceId: newRace.data.id,
          };
          await axios.post('/api/scores', score);
        }
      }
    }
    room();
  }, [user]);

  socket.on('start-race', (race) => {
    if (location.search === race.rid && racing === false) {
      setCountingDownPlayers(true);
      setRaceParagraph(race.words);
      setRaceId(race.raceId);
    }
    return function cleanup() {
      clearInterval(cdown);
      clearTimeout(ctimeout);
    };
  });

  socket.on('player-left', (player) => {
    let newPlayersList = players.filter((user) => user !== player.name);
    setPlayers(newPlayersList);
  });

  socket.on('new-player', (player) => {
    let newPlayersList = players;
    newPlayersList.push(player.name);
    setPlayers(newPlayersList);
  });

  useEffect(() => {
    let cdown;
    let ctimeout;
    let words;
    async function startRace() {
      function shuffle(array) {
        let currentIndex = array.length,
          randomIndex;

        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
          ];
        }

        return array;
      }
      words = shuffle(randomWords);
      setRaceParagraph(words);

      let { data } = await axios.get('/api/scores/roommatch', {
        headers: {
          roomid: +location.search.split('=')[1],
        },
      });
      socket.emit('start-race', {
        words,
        rid: location.search,
        raceId: data.id,
      });
    }
    if (countingDown === true) {
      startRace();
      cdown = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
      ctimeout = setTimeout(() => {
        clearInterval(cdown);
        setCountingDown(false);
        setRacing(true);
      }, 3000);
    }
    return function cleanup() {
      clearInterval(cdown);
      clearTimeout(ctimeout);
    };
  }, [countingDown]);

  useEffect(() => {
    let cdown;
    let ctimeout;
    if (countingDownPlayers === true) {
      cdown = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
      ctimeout = setTimeout(() => {
        clearInterval(cdown);
        setCountingDownPlayers(false);
        setRacing(true);
      }, 3000);
    }
    return function cleanup() {
      clearInterval(cdown);
      clearTimeout(ctimeout);
    };
  }, [countingDownPlayers]);

  useEffect(() => {
    if (raceCompleted === true) {
      async function fetchScores() {
        let score = {
          WPM,
          userId: user.id,
          timeElapsed: 30,
          wordsTyped,
          mode: 'sprintrace',
          raceId,
        };
        await axios.put('/api/scores/finalscore', score);
        setTimeout(async () => {
          let scores = await axios.get('/api/scores/sprintraceresults', {
            headers: {
              raceId,
            },
          });
          let { data } = scores;
          setResults(data.sort((a, b) => b.wpm - a.wpm));
        }, 1000);
      }
      fetchScores();
    }
  }, [raceCompleted]);

  useEffect(() => {
    let raceTimer;
    let racethirty;
    if (racing === true) {
      setCountdown(3);
      setTimer(30);
      setTimeElapsed(0);
      setRaceCompleted(false);
      setWordsTyped(0);
      setCharactersTyped(0);
      setallWPMs([]);
      setAverageWPM(0);
      setWrongWords([]);
      setDisplayWrongWords(false);
      setWPM(0);
      setCurrentlyTyped('');

      raceTimer = setInterval(() => {
        setTimer((timer) => timer - 1);
        setTimeElapsed((timeElapsed) => timeElapsed + 1);
      }, 1000);

      racethirty = setTimeout(() => {
        clearInterval(raceTimer);
        setRacing(false);
        setRaceCompleted(true);
      }, 30000);
    }
    return function cleanup() {
      clearInterval(raceTimer);
      clearTimeout(racethirty);
    };
  }, [racing]);

  useEffect(() => {
    setCurrentWord(raceParagraph[0]);
  }, [raceParagraph]);

  useEffect(() => {
    if (timer % 2 === 0) {
      setWPM(Math.round((wordsTyped / timeElapsed) * 60) || 0);
      setallWPMs([
        ...allWPMs,
        Math.round((wordsTyped / timeElapsed) * 60) || 0,
      ]);
      let average = 0;
      for (let i = 0; i < allWPMs.length; i++) {
        average += allWPMs[i];
      }
      average = average / allWPMs.length;
      setAverageWPM(Math.round(average));
    }
  }, [timer]);

  function handleChange(e) {
    if (e.target.value.slice(-1) !== ' ') {
      setCurrentlyTyped(e.target.value);
    }
  }

  function handleSpace(e) {
    if (e.keyCode === 32) {
      if (currentlyTyped === currentWord) {
        setCharactersTyped(charactersTyped + (currentlyTyped.length + 1));
        setWordsTyped(Math.floor(charactersTyped / 5));
        setRaceParagraph(raceParagraph.slice(1));
        setCurrentlyTyped('');
      } else {
        setWrongWords([...wrongWords, currentlyTyped]);
        setRaceParagraph(raceParagraph.slice(1));
        setCurrentlyTyped('');
      }
    }
  }

  return (
    <main id="single-race">
      <div>WPM: {WPM}</div>
      <div>
        {timer <= 10 ? (
          <div className="race-ending">Time left: {timer}</div>
        ) : (
          <div>Time left: {timer}</div>
        )}
      </div>
      <div id="race-paragraph">
        {' '}
        {raceParagraph.map((word, i) => {
          if (i === 0) {
            return (
              <span wordnumber={i} id="current-word" key={i}>
                {word}
              </span>
            );
          } else {
            return (
              <span wordnumber={i} key={i}>
                {word}
              </span>
            );
          }
        })}
      </div>
      {racing === true ? (
        <input
          id="currently-typed"
          name="currently-typed"
          type="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          autoFocus
          value={currentlyTyped}
          onChange={(e) => handleChange(e)}
          onKeyDown={(e) => handleSpace(e)}
        ></input>
      ) : null}
      {racing === false &&
      raceCompleted !== true &&
      countingDown === false &&
      countingDownPlayers === false ? (
        <div id="start">
          <p>
            <button id="start-button" onClick={() => setCountingDown(true)}>
              <p>Start 🏁</p>
            </button>
          </p>
          <p id="start-text">The race will begin once you click Start</p>
        </div>
      ) : raceCompleted !== true &&
        WPM > 60 &&
        countingDown === false &&
        countingDownPlayers === false ? (
        <img src="https://cdn.discordapp.com/emojis/925220507241033849.gif?size=96&quality=lossless" />
      ) : raceCompleted !== true &&
        WPM <= 60 &&
        countingDown === false &&
        countingDownPlayers === false ? (
        <img src="https://cdn.discordapp.com/emojis/863005286951550996.webp?size=96&quality=lossless" />
      ) : countingDown === true || countingDownPlayers === true ? (
        <h1>{countdown}</h1>
      ) : (
        <div id="start">
          <p>
            <button id="start-button" onClick={() => setCountingDown(true)}>
              <p>Play again 🏁</p>
            </button>
          </p>
          <p id="start-text">The race will begin once you click Start</p>
        </div>
      )}
      <br></br>
      {results.length > 0 && raceCompleted === true ? (
        <div id="race-results">
          <h3 style={{ color: 'green' }}>
            The winner is {results[0]['user'].username}!
          </h3>
          <div id="result-types">
            <div>WPM / WordsTyped</div>
          </div>
          <div className="race-result-list">
            {results.map((result, i) => {
              return (
                <div key={i} className="race-result">
                  <div>
                    {i + 1}. {result['user'].username} {result.wpm} /{' '}
                    {result.wordsTyped}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div id="players-list">
          <h1>Players</h1>
          {players.map((player, i) => {
            return (
              <h3 key={i} className="player">
                {player}
              </h3>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default SprintRace;
