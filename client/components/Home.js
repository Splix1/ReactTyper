import React, { useEffect } from 'react';


export default function Home() {

  console.log(process.env.NODE_ENV)

  return (
    <main>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <h1 style={{ display: 'flex', justifyContent: 'center' }}>
          WELCOME TO REACT TYPER
        </h1>
        <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/3663e444-4c76-4941-840e-997e40870d22/dehle7p-a2ebaeae-906f-49bb-b289-2904c209795d.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM2NjNlNDQ0LTRjNzYtNDk0MS04NDBlLTk5N2U0MDg3MGQyMlwvZGVobGU3cC1hMmViYWVhZS05MDZmLTQ5YmItYjI4OS0yOTA0YzIwOTc5NWQuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.tI8k88bs4hehpCaakzbW0UtQlquBnPQXogMM1GMNf6s" />
      </div>
    </main>
  );
}
