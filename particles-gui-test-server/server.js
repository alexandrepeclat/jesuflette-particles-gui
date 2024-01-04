const WebSocketServer = require('ws');
const PORT = 3000;
const wss = new WebSocketServer.Server({ port: PORT, host: '0.0.0.0' })
const states = ['HIDDEN', 'LOCKED', 'DISCOVERED', 'RESOLVED'];

const statesSequences = [
  [{ id: 0, state: states[0] }, { id: 1, state: states[0] }, { id: 2, state: states[0] }, { id: 3, state: states[0] }],
  [{ id: 0, state: states[1] }, { id: 1, state: states[0] }, { id: 2, state: states[0] }, { id: 3, state: states[0] }],
  [{ id: 0, state: states[2] }, { id: 1, state: states[0] }, { id: 2, state: states[0] }, { id: 3, state: states[0] }],
  [{ id: 0, state: states[3] }, { id: 1, state: states[0] }, { id: 2, state: states[0] }, { id: 3, state: states[0] }],
  [{ id: 0, state: states[3] }, { id: 1, state: states[1] }, { id: 2, state: states[0] }, { id: 3, state: states[0] }],
  [{ id: 0, state: states[3] }, { id: 1, state: states[2] }, { id: 2, state: states[0] }, { id: 3, state: states[0] }],
  [{ id: 0, state: states[3] }, { id: 1, state: states[3] }, { id: 2, state: states[0] }, { id: 3, state: states[0] }],
  [{ id: 0, state: states[3] }, { id: 1, state: states[3] }, { id: 2, state: states[1] }, { id: 3, state: states[0] }],
  [{ id: 0, state: states[3] }, { id: 1, state: states[3] }, { id: 2, state: states[2] }, { id: 3, state: states[0] }],
  [{ id: 0, state: states[3] }, { id: 1, state: states[3] }, { id: 2, state: states[3] }, { id: 3, state: states[0] }],
  [{ id: 0, state: states[3] }, { id: 1, state: states[3] }, { id: 2, state: states[3] }, { id: 3, state: states[1] }],
  [{ id: 0, state: states[3] }, { id: 1, state: states[3] }, { id: 2, state: states[3] }, { id: 3, state: states[2] }],
  [{ id: 0, state: states[3] }, { id: 1, state: states[3] }, { id: 2, state: states[3] }, { id: 3, state: states[3] }],
];


const example = {
  "logs": [],
  "title": "",
  "steps": [
    {
      id:0, //0-3
      state: "" //'HIDDEN', 'LOCKED', 'DISCOVERED', 'RESOLVED'
    }
  ]
}

wss.on('connection', (ws) => {
  console.log('Client connecté.');
  let i = 0;
  const sendStates = setInterval(() => {
    const data = {
      log: "Test sequence #" + i,
      steps: statesSequences[i]
    };
    i++;

    ws.send(JSON.stringify(data) + '\n');

    if(i >= statesSequences.length) {
      clearInterval(sendStates);
      ws.close(); // Terminer la connexion avec le client
      console.log('Envoi de données terminé.');


    }

  }, 1000);

});

console.log('WS serveur écoute sur ' + PORT);
