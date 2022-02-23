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

  useEffect(() => {
    setRaceParagraph(dummyData);
  }, []);

  useEffect(() => {
    setCurrentWord(raceParagraph[0]);
  }, [raceParagraph]);

  useEffect(() => {
    if (timer % 2 === 0) {
      setWPM(Math.round((wordsTyped / timeElapsed) * 60));
    }
  }, [timer]);

  useEffect(() => {
    if (racing === true) {
      let raceTimer = setInterval(() => {
        setTimer((timer -= 1));
        setTimeElapsed((timeElapsed += 1));
      }, 1000);

      setTimeout(() => {
        clearInterval(raceTimer);
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
        setWordsTyped(Math.round(charactersTyped / 5));
        setRaceParagraph(raceParagraph.slice(1));
        setCurrentlyTyped('');
      } else {
        setRaceParagraph(raceParagraph.slice(1));
        setCurrentlyTyped('');
      }
    }
  }

  // function startRace() {
  //   setRacing(true);

  //   // let WPMtimer = setInterval(() => {
  //   //   setWPM(Math.round((wordsTyped / timeElapsed) * 60));
  //   // }, 2000);

  //   let raceTimer = setInterval(() => {
  //     setTimer((timer -= 1));
  //     setTimeElapsed((timeElapsed += 1));
  //   }, 1000);

  //   setTimeout(() => {
  //     clearInterval(raceTimer);
  //     // clearInterval(WPMtimer);
  //   }, 30000);
  // }

  return (
    <main id="single-race">
      <div>WPM: {isNaN(WPM) ? 0 : WPM}</div>
      <div>Time left: {timer}</div>
      <div id="race-paragraph">
        {' '}
        <p>{raceParagraph.join(' ')}</p>
      </div>
      <input
        id="currently-typed"
        name="currently-typed"
        type="text"
        value={currentlyTyped}
        onChange={(e) => handleChange(e)}
        onKeyDown={(e) => handleSpace(e)}
      ></input>
      {racing === false ? (
        <button onClick={() => setRacing(true)}>Start</button>
      ) : null}
    </main>
  );
}

export default SingleRace;
