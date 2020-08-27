const ETAT_INITIALISATION = 0;
const ETAT_DEPLACEMENT = 1;
const ETAT_COMBAT = 2;

class Game{
    constructor() {
        this.etat = ETAT_INITIALISATION;
        this.map = new Map(10, 10, 0, 0, 10); // création d'un nouvel objet avec la classe Map.
        this.armes;
        this.joueurs;
        this.indexJoueurActuel = 0;
    }

    /**
     * Initialise la map, les armes, et les joueurs
     * @param { Weapon[] } armes
     * @param { Player[] } joueurs
     */
    initialiser(armes = [], joueurs = []) { 
        this.armes = armes;
        this.joueurs = joueurs;

        this.joueurs.forEach(joueur => joueur.game = this);
        
        this.map.genererMapVide(); // Génère une map vide.
        this.map.genererCasesObstacles(); // Rajoute des cases obstacles sur la map vide.

        // Insertion des armes dans la map
        this.map.insererArmesMap(this.armes);

        // Insertion des joueurs dans la map
        this.map.insererJoueursMap(this.joueurs);

        // Affichage des infos joueurs sur la page dans les parties réservées à chacun des joueurs.
        this.afficherInfosJoueurs(this.joueurs);

        // Utilisation du .bind pour garder le `this` lors de l'éxecution de la méthode `onCellClick`
        $('td').each((idx, cellule) => cellule.addEventListener('click', this.onCellClick.bind(this)));
    }

    /**
     * Débute la partie
     */
    demarrer() {
        this.etat = ETAT_DEPLACEMENT;
        this.joueurs[this.indexJoueurActuel].casesPossiblesDeplacement();
    }

    onCellClick(event) {
        const cellule = event.target;
        if (!cellule.classList.contains('casesSurbrillance')) return;
        if (this.etat !== ETAT_DEPLACEMENT) return;
        
        const joueurActuel = this.joueurs[this.indexJoueurActuel];

        this.deplacer(joueurActuel, cellule);
    }

    /**
     * Déplace le joueur donné sur la cellule donnée
     * @param { Player } joueur
     * @param { HTMLElement } cellule
     */
    deplacer(joueur, cellule) {
        /*
        // Pour gérer la récupération d'armes sur les cases, on récupère les cases de la map ayant la classe css casesArmes.
        let $casesArmes = $('.casesArmes');
        console.log("CONTENU CASES ARMES AU DEBUT DU TOUR: ", $casesArmes.text());

        // On fait un tableau des coordonnées de toutes les cases armes.
        let positionCasesArmes = [];
        for (let i = 0; i < $casesArmes.length; i++) {
            positionCasesArmes.push(extraireCoordonneesId($casesArmes[i]));
        }*/
        /////////////////////////////////////////////////////////////////

        // On efface les cases en surbrillance.
        this.map.viderCasesSurbrillance();

        // On récupère les coordonnées de la case cliquée.
        const nouvellePositionJoueur = extraireCoordonneesId(cellule);

        // On récupère les coordonnées de la case actuelle du joueur (avant déplacement).
        const positionActuelle = joueur.coord;

        // On récupère la case actuelle en fonction des coordonnées actuelles.
        const $caseActuelle = $(`#${positionActuelle.x}-${positionActuelle.y}`);

        // On efface la classe css de l'ancienne case joueur.
        $caseActuelle.removeClass('casesJoueurs').text("");
        /*
        if ($caseActuelle.hasClass('casesArmes')) {

        } else {
            $caseActuelle.text("");
        } */

        // On déplace le joueur sur la nouvelle case.
        joueur.coord = [nouvellePositionJoueur.x, nouvellePositionJoueur.y];

        let $nouvelleCaseJoueur = $(`#${nouvellePositionJoueur.x}-${nouvellePositionJoueur.y}`);

        // Si la nouvelle case joueur est aussi une case contenant une arme.
        if ($nouvelleCaseJoueur.hasClass('casesArmes')) {
            // On retire l'arme de la case.
            let $contenuCaseArme = $nouvelleCaseJoueur;
            console.log("CONTENU CASE ARME NOUVELLE POSITION JOUEUR: ", $contenuCaseArme); // TODO: A enlever.

            // On transfère l'arme dans une case temporaire.
            let $caseArmeTemporaire = $contenuCaseArme.html();
            console.log("RECUP DANS LA VARIABLE TEMPORAIRE: ", $caseArmeTemporaire); // TODO: A enlever.

            // On dépose l'arme du joueur dans la case ou se trouvait l'arme.
            $contenuCaseArme = joueur.arme;
            // TODO: que faire de l'ancienne arme du joueur??? Impossible de la mettre dans la même case que le joueur??
            console.log("DEPOT DE L'ARME DU JOUEUR: ", $contenuCaseArme); // TODO: A enlever.

            // Le joueur récupère l'arme contenu dans la variable temporaire.
            joueur.arme = $caseArmeTemporaire;
            console.log("VALEUR JOUEUR.ARME APRES RECUP: ", joueur.arme); // TODO: A enlever.

            // On actualise la nouvelle arme dans les infos joueurs sur les côtés.
            $("#armeJoueur" + this.indexJoueurActuel).text(joueur.arme);
        }
        // Pour la nouvelle case joueur, on attribue la classe css "casesJoueur", et le nom du joueur.
        $nouvelleCaseJoueur.addClass('casesJoueurs').text(joueur.nom);
        console.log("JOUEUR ACTUEL: ", this.joueurs[this.indexJoueurActuel]);// TODO: A enlever.

        // Vérifier si un autre joueur (joueurB) est collé à `joueur`
        const joueurPotentiel = newVerifierCasesAdjacentes(
            $nouvelleCaseJoueur[0],
            (cellule, prev) => {
                // Si la valeur précédente n'est pas un boolean (donc est une cellule)
                if (typeof prev !== "boolean") return prev;
                if (!cellule) return false;

                // Renvoi de la cellule actuellement testée, ou de false
                return cellule.classList.contains("casesJoueurs")
                        ? cellule
                        : false;
            }
        );

        // Si un joueur est trouvé dans les cases adjacentes
        if (joueurPotentiel !== false) {
            this.etat = ETAT_COMBAT;
            //this.combattre();
        }

        this.finirLeTour();
    }

    /**
     * Permet d'afficher les infos des joueurs
     * @param { Player } joueurs
     */
    // Permet d'afficher sur les cotés de la map, les infos des joueurs.
    afficherInfosJoueurs(joueurs) {
        //TODO: Voir si possible de déplacer cette méthode dans la class Player.
        $('#santeJoueur0').text(this.joueurs[0].sante);
        $('#armeJoueur0').text(this.joueurs[0].arme.nom);
        $('#santeJoueur1').text(this.joueurs[1].sante);
        $('#armeJoueur1').text(this.joueurs[1].arme.nom);
    }

    combattre() {

    }

    /**
     * Permet au joueurA d'attaquer joueurB
     * @param { Player } joueurA
     * @param { Player } joueurB
     */
    attaquer(joueurA, joueurB) {
        joueurB.sante -= joueurA.arme.degats;
        if (joueurB.sante > 0) {
            // Vivant
            this.finirLeTour();
        } else {
            // Mort
            this.finirLaPartie();
        }
        //TODO: Gérer le cas du joueur B qui attaque ?
    }

    /**
     * Permet au joueur de se défendre de la prochaine attaque
     * @param { Player } joueur
     */
    defendre(joueur) {

    }

    /**
     * Passe au tour du joueur suivant
     */
    finirLeTour() {
        switch (this.etat) {
            case ETAT_INITIALISATION:
            default:
                // Problem ?
                console.log("DEFAULT CASE !");
                break;
            case ETAT_DEPLACEMENT:
                this.indexJoueurActuel++;
                if (this.indexJoueurActuel > this.joueurs.length - 1)
                    this.indexJoueurActuel = 0;
                this.joueurs[this.indexJoueurActuel].casesPossiblesDeplacement();
                break;
            case ETAT_COMBAT:
                console.log("FIGHT CASE !");
                break;
        }
    }

    /**
     * Arrête la partie et affiche les scores
     */
    finirLaPartie() {

    }
}

/**
Déroulement d'un tour
Exemple: joueurA

MOUVEMENT : 

    joueurA doit sélectionner une case pour se déplacer
    joueurA se déplace

        Si joueurA atteint une case "weapon", il "remplace" son arme actuelle par l'arme de la case.
        Si joueurA atteint une case adjacente à celle d'un autre joueur, la partie "combat" commence.

COMBAT : 

    joueurA choisis entre : 
        Attaquer
        Se défendre

    Si joueurA décide d'attaquer, le second joueur reçoit des dégats
    Si joueurA décide de se défendre, un bouclier de 50% est activé

Si l'autre joueur arrive à 0 points de vie, joueurA gagne et la partie s'arrête
Sinon fin du tour
*/