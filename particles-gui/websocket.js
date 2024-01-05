
document.addEventListener('DOMContentLoaded', function () {


    var serverUrl = new URLSearchParams(window.location.search).get('serverUrl'); //'ws://localhost:3000';

    if (serverUrl === undefined || serverUrl == null) {
        updateLogs("Url websocket invalide: " + serverUrl + " usage: http://xxx.yyy:8888?serverUrl=ws://server:port");
        return;
    }

    let socket;

    setInterval(() => {
        if (socket && socket.readyState === WebSocket.CLOSED)
            connect();
    }, 8000);

    function connect() {
        updateLogs('Connexion au serveur des ténèbres : ' + serverUrl);

        socket = new WebSocket(serverUrl);

        // Événement déclenché lorsqu'un message est reçu du serveur
        socket.onmessage = (event) => {
            console.debug(event.data);
            const data = JSON.parse(event.data); // Convertir la chaîne JSON en objet JavaScript
            if ('log' in data) {
                // updateLogs(data.log);
                updateLogs(data.log);
            }
            if ('title' in data) {
                updateTitle(data.title);
            }
            if ('steps' in data) {
                for (let i = 0; i < data.steps.length; i++) {
                    let symbolId = data.steps[i].id;
                    if (symbols[symbolId] === undefined)
                        continue;
                    symbols[symbolId].processToState(data.steps[i].state);
                }
                states = data.steps;
            }
        };

        socket.onopen = () => {
            for (let i = 0; i < symbols.length; i++) {
                symbols[i].processToState('INIT');
            }
            updateLogs('Connexion établie');
        };

        // Gestion des erreurs
        socket.onerror = (error) => {
            updateLogs('Erreur de connexion' + error);

        };

        // Événement déclenché lors de la fermeture de la connexion
        socket.onclose = () => {
            updateLogs('Connexion fermée');

        };

        // Fermer la connexion WebSocket lorsque vous avez terminé
        // socket.close();
    }
    connect();

}, false);

