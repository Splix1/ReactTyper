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
        console.log(`IF THERE IS A MATCH FOR THIS ROOM`);
        if (!data.completed && !data.inProgress) {
          console.log(`IF THE MATCH HASN'T STARTED YET AND ISN'T COMPLETED`);
          if (user.id) {
            console.log(`IF USER IS LOGGED IN`);
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
            console.log(`IF SCORE EXISTS:`, ifScoreExists);

            if (ifScoreExists === null) {
              await axios.post('/api/scores', score);
            }
            console.log(`RACE ID:`, data.id);
            setRaceId(data.id);
          }
        } else {
          console.log(`IF THERE IS NO AVAIABLE MATCH FOR THIS ROOM`);
          if (user.id) {
            console.log(`IF USER IS SIGNED IN`);
            let newRace = await axios.post('/api/scores/newrace', {
              roomID: +location.search.split('=')[1],
              completed: false,
              inProgress: false,
            });
            console.log(`NEW RACE ID:`, newRace.data.id);
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
        console.log(`IF THERE IS NO MATCHES AT ALL FOR THIS ROOM`);
        if (user.id) {
          console.log(`IF USER IS SIGNED IN`);
          let newRace = await axios.post('/api/scores/newrace', {
            roomID: +location.search.split('=')[1],
            completed: false,
            inProgress: false,
          });
          console.log(`NEW RACE ID:`, newRace.data.id);
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
    if (location.search === race.rid && racing === false) {
      setRaceParagraph(race.words);
      setRacing(true);
      setRaceId(race.raceId);
    }
  });

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
    let words = shuffle(randomWords);
    setRaceParagraph(words);
    setRacing(true);

    let { data } = await axios.get('/api/scores/roommatch', {
      headers: {
        roomid: +location.search.split('=')[1],
      },
    });
    socket.emit('start-race', { words, rid: location.search, raceId: data.id });
  }

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
    if (racing === true) {
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

      let raceTimer = setInterval(() => {
        setTimer((timer) => timer - 1);
        setTimeElapsed((timeElapsed) => timeElapsed + 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(raceTimer);
        setRacing(false);
        setRaceCompleted(true);
      }, 30000);
    }
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
      {racing === false && raceCompleted !== true ? (
        <div id="start">
          <p>
            <button id="start-button" onClick={startRace}>
              <p>Start 🏁</p>
            </button>
          </p>
          <p id="start-text">The race will begin once you click Start</p>
        </div>
      ) : raceCompleted !== true && WPM > 60 ? (
        <img src="https://cdn.discordapp.com/emojis/925220507241033849.gif?size=96&quality=lossless" />
      ) : raceCompleted !== true && WPM <= 60 ? (
        <img src="https://cdn.discordapp.com/emojis/863005286951550996.webp?size=96&quality=lossless" />
      ) : (
        <div id="start">
          <p>
            <button id="start-button" onClick={startRace}>
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
