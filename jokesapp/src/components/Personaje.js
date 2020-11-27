import React, { useState, useEffect } from "react";
import md5 from "md5";

export default function Personaje() {
  const [personajes, setPersonaje] = useState(null);

  let content = "Cargando..";

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("personajes") === null) {
        setPersonaje("Loading...");
      } else {
        setPersonaje(JSON.parse(localStorage.getItem("personajes")));
      }
    } else {
      let url = new URL("https://gateway.marvel.com/v1/public/personajes");
      const ts = "welcome";
      const privada = "982cac68fa386b68b041167129d0d3f7c7a94d95";
      const publica = "e6922c73089c7398de76e7c759ab7fc7";

      const hash = md5(ts + privada + publica);

      const params = new URLSearchParams({
        ts: ts,
        hash: hash,
        apikey: publica,
      });

      url.search = params;

      fetch(url)
        .then((res) => res.json())
        .then((res) => {
          setPersonaje(res.data.results);
          localStorage.setItem("personajes", JSON.stringify(res.data.results));
        });
    }
  }, []);

  if (personajes) {
    content = personajes.map((personaje, index) => (
      <div key={index} className="polaroid">
        <img
          src={personaje.thumbnail.path + "." + personaje.thumbnail.extension}
          alt={personaje.name}
        />
        <p>{personaje.name}</p>
      </div>
    ));
  }

  return (
    <main>
      <h1>Personajes Marvel</h1>
      <div className="wrapper">{content}</div>
    </main>
  );
}
