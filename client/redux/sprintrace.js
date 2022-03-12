import axios from 'axios';

const ADD_PLAYER = 'ADD_PLAYER';

export const addPlayer = (player) => {
  return async (dispatch) => {
    try {
    } catch (err) {
      console.log('Failed to add player');
    }
  };
};

export default function (state = [], action) {
  switch (action.type) {
    default:
      return state;
  }
}
