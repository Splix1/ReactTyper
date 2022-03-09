import React, { useState, useEffect } from 'react';
import randomWords from '../../public/randomwords';

function SingleRace() {
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

  useEffect(() => {
    if (racing === true) {
      setTimer(30);
      setTimeElapsed(0);
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
      setRaceParagraph(shuffle(randomWords));
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

  function showWrongWords(e) {
    e.preventDefault();
    setDisplayWrongWords(!displayWrongWords);
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
          autoFocus
          value={currentlyTyped}
          onChange={(e) => handleChange(e)}
          onKeyDown={(e) => handleSpace(e)}
        ></input>
      ) : null}
      {racing === false && raceCompleted !== true ? (
        <div id="start">
          <p>
            <button id="start-button" onClick={() => setRacing(true)}>
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
            <button id="start-button" onClick={() => setRacing(true)}>
              <p>Play again 🏁</p>
            </button>
          </p>
          <p id="start-text">The race will begin once you click Start</p>
        </div>
      )}
      <br></br>
      {raceCompleted === true && displayWrongWords === true ? (
        <div id="wrong-words">
          Wrong words:
          <br></br>
          {wrongWords.map((word, i) => {
            return (
              <span key={i} className="wrong-word">
                {word}
              </span>
            );
          })}
        </div>
      ) : null}
      {raceCompleted === true ? (
        <div id="race-stats">
          <div id="race-types">
            <div>WPM:</div>
            <div>Average WPM:</div>
            <div>Correct words:</div>
            <div>Wrong words:</div>
            <button onClick={(e) => showWrongWords(e)}>See wrong words</button>
          </div>
          <div id="stats">
            <div>{WPM}</div>
            <div>{averageWPM}</div>
            <div>{wordsTyped}</div>
            <div>{wrongWords.length}</div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default SingleRace;
