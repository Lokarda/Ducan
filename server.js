const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // ← OVO je ključno, mora biti definirano prije korištenja

app.use(express.static('public'));

let artikli = [
  { id: 1, naziv: 'Kruh', uzet: false },
  { id: 2, naziv: 'Mlijeko', uzet: false },
  { id: 3, naziv: 'Jaja', uzet: false }
];

io.on('connection', (socket) => {
  console.log('Korisnik spojen');

  // Pošalji početne artikle
  socket.emit('artikli', artikli);

  // Kad korisnik označi artikl kao uzet
  socket.on('uzmiArtikl', (id) => {
    artikli = artikli.map(a => a.id === id ? { ...a, uzet: true } : a);
    io.emit('artikli', artikli);
  });

  // Kad korisnik doda novi artikl
  socket.on('dodajArtikl', (naziv) => {
    const noviId = artikli.length ? artikli[artikli.length - 1].id + 1 : 1;
    const noviArtikl = { id: noviId, naziv, uzet: false };
    artikli.push(noviArtikl);
    io.emit('artikli', artikli);
  });

  socket.on('disconnect', () => {
    console.log('Korisnik se odspojio');
  });
});

server.listen(3000, () => {
  console.log('Server pokrenut na http://localhost:3000');
});

