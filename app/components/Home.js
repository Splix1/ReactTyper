import React, { useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

export default function Home() {
  const history = useHistory();

  useEffect(() => {
    history.push('/');
  }, []);

  return (
    <main>
      <div>Test your speed!</div>
    </main>
  );
}
