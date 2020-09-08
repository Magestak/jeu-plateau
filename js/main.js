$(document).ready(function () {
    // Création de la partie
    const partie = new Game();

    // Création des armes avec la classe Weapon (fichier weapons.js)
    const epee = new Weapon("Epée",'<img src="../img/epee2-min.png" alt="epee" class="imgTableau">', 20);
    const hache = new Weapon("Hache",'<img src="../img/hache2-min.png" alt="hache" class="imgTableau">', 20);
    const arc = new Weapon("Arc",'<img src="../img/arc2-min.png" alt="arc" class="imgTableau">', 30);
    const arbalete = new Weapon("Arbalète",'<img src="../img/arbalete2-min.png" alt="arbalete" class="imgTableau">', 30);

    // On crée un tableau avec les armes qui seront positionnées sur la map.
    const tableauArmes = [epee, hache, arc, arbalete];

    // Création des joueurs avec la class Player.
    const joueurA = new Player("Le Lutin",'<img src="../img/lutin2-min.png" alt="lutin" class="imgTableau">', 100);
    const joueurB = new Player("La Lutine", '<img src="../img/lutine2-min.png" alt="lutine" class="imgTableau">',100);

    // On crée un tableau avec les joueurs qui seront positionnés sur la map.
    const tableauJoueurs = [joueurA, joueurB];

    // Initialisation de la partie.
    partie.initialiser(tableauArmes, tableauJoueurs);

    // Débute la partie.
    $('#demarrer').on('click', function () {
        $('#ecranDepart').fadeOut('slow'); // L'écran de démarrage disparait.
        partie.demarrer(); // La partie démarre.
    });
});
