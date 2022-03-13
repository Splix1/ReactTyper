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
      fetchingPlayers = setInterval(async () => {
        fetchPlayers();
      }, 5000);
    } else {
      if (fetchingPlayers) {
        clearInterval(fetchingPlayers);
      }
    }
    return function cleanup() {
      clearInterval(fetchingPlayers);
    };
  }, [raceId, racing]);

  async function fetchPlayers() {
    let { data } = await axios.get('/api/scores/listofplayers', {
      headers: {
        raceid: raceId,
      },
    });
    setPlayers(data);
    return;
  }

  useEffect(() => {
    async function room() {
      let { data } = await axios.get('/api/scores/roommatch', {
        headers: {
          roomid: +location.search.split('=')[1],
        },
      });

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
          }
        } else {
          if (user.id) {
            let newRace = await axios.post('/api/scores/newrace', {
              roomID: +location.search.split('=')[1],
              completed: false,
              inProgress: false,
            });

            setRaceId(newRace.data.id);
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
    console.log('bruh');
    let cdown;
    let ctimeout;
    if (location.search === race.rid && racing === false) {
      setCountingDownPlayers(true);
      cdown = setInterval(() => {
        setCountdown((countdown -= 1));
      }, 1000);
      ctimeout = setTimeout(() => {
        clearInterval(cdown);
        setCountingDownPlayers(false);
        setRaceParagraph(race.words);
        setRacing(true);
      }, 3000);
      setRaceId(race.raceId);
    }
    return function cleanup() {
      clearInterval(cdown);
      clearTimeout(ctimeout);
    };
  });

  useEffect(() => {
    let cdown;
    let ctimeout;
    let words;
    if (countingDown === true) {
      console.log('bruh?');
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
      }
      startRace();
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
      cdown = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
      ctimeout = setTimeout(() => {
        clearInterval(cdown);
        setCountingDown(false);
        setRaceParagraph(words);
        setRacing(true);
      }, 3000);
    }
    return function cleanup() {
      clearInterval(cdown);
      clearTimeout(ctimeout);
    };
  }, [countingDown]);

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
      {racing === false && raceCompleted !== true && countingDown === false ? (
        <div id="start">
          <p>
            <button id="start-button" onClick={() => setCountingDown(true)}>
              <p>Start 🏁</p>
            </button>
          </p>
          <p id="start-text">The race will begin once you click Start</p>
        </div>
      ) : raceCompleted !== true && WPM > 60 && countingDown === false ? (
        <img src="https://cdn.discordapp.com/emojis/925220507241033849.gif?size=96&quality=lossless" />
      ) : raceCompleted !== true && WPM <= 60 && countingDown === false ? (
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
            <span>Rank</span>
            <span>Name</span>
            <span>WPM</span>
            <span>Words Typed</span>
          </div>
          <div className="race-result-list">
            {results.map((result, i) => {
              return (
                <span key={i} className="race-result">
                  <span>{i + 1}.</span>
                  <span>{result['user'].username}</span>
                  <span>
                    {result.wpm}/{result.wordsTyped}
                  </span>
                </span>
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
                {player['user'].username}
              </h3>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default SprintRace;
