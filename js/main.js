$(document).ready(function () {
    // Création de la partie
    const partie = new Game();

    // Création des armes avec la classe Weapon (fichier weapons.js)
    const baton = new Weapon("Bâton", 10); // Arme initiale des 2 joueurs
    const epee = new Weapon("Epée", 20);
    const massue = new Weapon("Massue", 20);
    const arc = new Weapon("Arc", 30);
    const arbalete = new Weapon("Arbalète", 30);

    // On crée un tableau avec les armes qui seront positionnées sur la map.
    const tableauArmes = [epee, massue, arc, arbalete];

    // Création des joueurs avec la class Player
    const joueurA = new Player("Joueur A", 100, baton);
    const joueurB = new Player("Joueur B", 100, baton);

    // On crée un tableau avec les joueurs qui seront positionnés sur la map
    const tableauJoueurs = [joueurA, joueurB];

    // Initialisation de la partie
    partie.initialiser(tableauArmes, tableauJoueurs);

    // Débute la partie
    partie.demarrer();

});
