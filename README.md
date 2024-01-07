Projet GUI pour anniversaire Nicolas 2024
- Projeter des particules contre le mur avec un beamer
- Projeter des symboles sur un livre devant le mur avec correction de la perspective
- Connecté à un serveur donnant l'état du jeu implémenté sur un autre serveur

### GUI client
GUI disponible ici (en paramètre le websocket du serveur de jeu)
https://alexandrepeclat.github.io/particles/particles-gui/?serverUrl=xxx

Commandes :
> A S Y X : définir les 4 coins pour l'affichage sur le livre
> 1 2 3 4 : choisir l'un des 4 symboles
> Q W E R : changer l'état du symbole en cours (Caché, Orbite, Image, Livre)

### Serveur de test
Serveur de test NodeJS qui joue le jeu automatiquement de A-Z dans le dossier "particles-gui-test-server"
Lancer avec 
```
cd particles-gui-test-server
node server.js
```
