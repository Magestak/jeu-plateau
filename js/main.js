$(document).ready(function(){
    const newMap = new Map(10, 10, 0, 0, 10); // création d'un nouvel objet avec la classe Map (fichier map.js)
    newMap.genererMapVide(); // Génère une map vide (fichier map.js)
    newMap.genererCasesObstacles(); // Rajoute des cases obstacles sur la map vide (fichier map.js)

    // Création des armes avec la classe Weapon
    const baton = new Weapon("Bâton", 10); // Arme initiale des 2 joueurs
    const epee = new Weapon("Epée", 20);
    const massue = new Weapon("Massue", 20);
    const arc = new Weapon("Arc", 30);
    const arbalete = new Weapon("Arbalète", 30);
    // On crée un tableau avec les armes qui seront positionnées sur la map.
    const tableauArme = [epee, massue, arc, arbalete];


});

window.onload = function() {

}

