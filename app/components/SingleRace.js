import React, { useState, useEffect } from 'react';

let dummyData = [
  'you',
  'know',
  'when',
  'I',
  'was',
  'your',
  'age',
  'I',
  'went',
  'out',
  'to',
  'fishing',
  'with',
  'all',
  'my',
  'brothers',
  'and',
  'my',
  'father',
  'and',
  'everybody',
  'and',
  'I',
  'was',
  'the',
  'only',
  'one',
  'who',
  'caught',
  'a',
  'fish',
  'you',
  'know',
  'when',
  'I',
  'was',
  'your',
  'age',
  'I',
  'went',
  'out',
  'to',
  'fishing',
  'with',
  'all',
  'my',
  'brothers',
  'and',
  'my',
  'father',
  'and',
  'everybody',
  'and',
  'I',
  'was',
  'the',
  'only',
  'one',
  'who',
  'caught',
  'a',
  'fish',
];

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

  useEffect(() => {
    setRaceParagraph(dummyData);
  }, []);

  useEffect(() => {
    setCurrentWord(raceParagraph[0]);
  }, [raceParagraph]);

  useEffect(() => {
    if (timer % 2 === 0) {
      setWPM(Math.round((wordsTyped / timeElapsed) * 60) || 0);
    }
  }, [timer]);

  useEffect(() => {
    if (racing) {
      let raceTimer = setInterval(() => {
        setTimer((timer -= 1));
        setTimeElapsed((timeElapsed += 1));
      }, 1000);

      setTimeout(() => {
        clearInterval(raceTimer);
        setRacing(false);
        setRaceCompleted(true);
      }, 30000);
    }
  }, [racing]);

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
      ) : (
        <img src="https://cdn.discordapp.com/emojis/925220507241033849.gif?size=96&quality=lossless" />
      )}
      <br></br>
      {raceCompleted === true ? <div></div> : null}
    </main>
  );
}

export default SingleRace;
