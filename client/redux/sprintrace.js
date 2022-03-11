import axios from 'axios';

const SET_WORDS = 'SET_WORDS';

export const setWords = (words) => ({
  type: SET_WORDS,
  words,
});

export default function (state = {}, action) {
  switch (action.type) {
    case SET_WORDS: {
    }
    default:
      return state;
  }
}
