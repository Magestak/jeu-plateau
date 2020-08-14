$(document).ready(function() {
    const newMap = new Map(10, 10, 0, 0, 10); // création d'un nouvel objet avec la classe Map (fichier map.js)
    newMap.genererMapVide(); // Génère une map vide (fichier map.js)
    newMap.genererCasesObstacles(); // Rajoute des cases obstacles sur la map vide (fichier map.js)

    // Création des armes avec la classe Weapon (fichier weapons.js)
    const baton = new Weapon("Bâton", 10); // Arme initiale des 2 joueurs
    const epee = new Weapon("Epée", 20);
    const massue = new Weapon("Massue", 20);
    const arc = new Weapon("Arc", 30);
    const arbalete = new Weapon("Arbalète", 30);
    // On crée un tableau avec les armes qui seront positionnées sur la map.
    const tableauArmes = [epee, massue, arc, arbalete];
    // Insertion des armes dans la map
    newMap.insererArmesMap(tableauArmes); // Méthode class Map (fichier map.js)

    // Création des joueurs avec la class Player
    const joueurA = new Player("Joueur A", 100, baton);
    const joueurB = new Player("Joueur B", 100, baton);
    console.log(joueurA.coordonnees); // TEST///////////////////
    console.log(joueurB.coordonnees); // TEST///////////////////
    // On crée un tableau avec les joueurs qui seront positionnés sur la map
    const tableauJoueurs = [joueurA, joueurB];
    // Insertion des joueurs dans la map
    newMap.insererJoueursMap(tableauJoueurs);
});

/*
window.onload = function() {

}*/
