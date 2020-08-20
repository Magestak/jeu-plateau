const ETAT_INITIALISATION = 0;
const ETAT_DEPLACEMENT = 1;
const ETAT_COMBAT = 2;

class Game{
    constructor() {
        this.etat = ETAT_INITIALISATION;
        this.map = new Map(10, 10, 0, 0, 10); // création d'un nouvel objet avec la classe Map (fichier map.js)
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
        
        this.map.genererMapVide(); // Génère une map vide (fichier map.js)
        this.map.genererCasesObstacles(); // Rajoute des cases obstacles sur la map vide (fichier map.js)

        // Insertion des armes dans la map
        this.map.insererArmesMap(this.armes); // Méthode class Map (fichier map.js)

        // Insertion des joueurs dans la map
        this.map.insererJoueursMap(this.joueurs);
    }

    /**
     * Débute la partie
     */
    demarrer() {
        this.etat = ETAT_DEPLACEMENT;
        this.joueurs[this.indexJoueurActuel].casesPossiblesDeplacement();
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
    }

    /**
     * Déplace le joueur donné sur la cellule donnée
     * @param { Player } joueur
     * @param { HTMLElement } cellule
     */
    deplacer(joueur, cellule) {
        // On récupère l'id de la case cliquée.
        let $newPosJoueurId = cellule.id.split('-');
        // On converti l'id pour récupérer les nouvelles coordonnées de la case joueur.
        let newPosJoueur = $newPosJoueurId.map(Number);

        // On récupère les coordonnées de la case actuelle du joueur (avant déplacement).
        const positionActuelle = joueur.coord;
        // On récupère la case actuelle en fonction des coordonnées actuelles.
        const $caseActuelle = $(`#${positionActuelle.x}-${positionActuelle.y}`);

        // On efface le contenu et la classe css de l'ancienne case joueur.
        $caseActuelle.removeClass('casesJoueurs').html("");

        // On déplace le joueur sur la nouvelle case
        joueur.coord = newPosJoueur;

        // Pour la nouvelle case joueur, on attribue la classe css "casesJoueur", et le nom du joueur.
        let $nouvelleCaseJoueur = $(`#${newPosJoueur[0]}-${newPosJoueur[1]}`);
        $nouvelleCaseJoueur.addClass('casesJoueurs').html(joueur.nom);

        // TODO Vérifier si un autre joueur (joueurB) est collé à `joueur`.
        // Si oui, Passer la game en mode combat
        // Si non, finir le tour

        // Si un joueur est trouvé dans les cases adjacentes
        /*
        if (verifierCasesAdjacentes($nouvelleCaseJoueur, coords => {
            return [
                $(`#${coords.x - 1}-${coords.y}`),
                $(`#${coords.x + 1}-${coords.y}`),
                $(`#${coords.x}-${coords.y - 1}`),
                $(`#${coords.x}-${coords.y + 1}`)
            ].reduce((prev, curr) => {
                if (prev) return true;
                if (curr.length === 0) return prev;
                return curr.hasClass('casesJoueurs');
            }, false);
        }) === true){
            this.etat = ETAT_COMBAT;
        }
        
        this.finirLeTour(); */
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
                break;
            case ETAT_DEPLACEMENT:
                // this.indexJoueurActuel++;
                if (this.indexJoueurActuel > this.joueurs.length - 1)
                    this.indexJoueurActual = 0;
                this.joueurs[this.indexJoueurActuel].casesPossiblesDeplacement();
                break;
            case ETAT_COMBAT:

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