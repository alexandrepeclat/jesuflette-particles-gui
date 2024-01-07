Projet GUI pour anniversaire Nicolas 2024
- Projeter des particules contre le mur avec un beamer
- Projeter des symboles sur un livre devant le mur avec correction de la perspective
- Connecté à un serveur qui gère le jeu et pilote cette GUI

### GUI client
GUI disponible ici (en paramètre le websocket du serveur de jeu)
https://alexandrepeclat.github.io/jesuflette-particles-gui/particles-gui/?serverUrl=ws://localhost:3000

Commandes (peuvent être utilisées sans serveur de pilotage) :
```
> A S Y X : définir les 4 coins pour l'affichage sur le livre (avec la souris)
> 1 2 3 4 : choisir l'un des 4 symboles
> Q W E R : changer l'état du symbole en cours (HIDDEN, LOCKED, DISCOVERED, RESOLVED)
> C : effacer les logs
> H : mettre tous les symbols dans l'état initial (HIDDEN)
```

### Serveur de test
Serveur de test NodeJS qui joue le jeu automatiquement de A-Z dans le dossier "particles-gui-test-server"
Lancer avec 
```
cd particles-gui-test-server
node server.js
```
