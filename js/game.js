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
        // On efface les cases en surbrillance.
        this.map.viderCasesSurbrillance();

        // On récupère les coordonnées de la case cliquée.
        const newPosJoueur = extraireCoordonneesId(cellule);

        // On récupère les coordonnées de la case actuelle du joueur (avant déplacement).
        const positionActuelle = joueur.coord;

        // On récupère la case actuelle en fonction des coordonnées actuelles.
        const $caseActuelle = $(`#${positionActuelle.x}-${positionActuelle.y}`);

        // On efface le contenu et la classe css de l'ancienne case joueur.
        $caseActuelle.removeClass('casesJoueurs').html("");

        // On déplace le joueur sur la nouvelle case
        joueur.coord = [newPosJoueur.x, newPosJoueur.y];

        // Pour la nouvelle case joueur, on attribue la classe css "casesJoueur", et le nom du joueur.
        let $nouvelleCaseJoueur = $(`#${newPosJoueur.x}-${newPosJoueur.y}`);
        $nouvelleCaseJoueur.addClass('casesJoueurs').html(joueur.nom);

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
        if (joueurPotentiel !== false)
            this.etat = ETAT_COMBAT;

        //TODO: Si le joueur passe sur une case arme, il échange avec son arme actuelle (qu'il laisse à la place).
        //      Attention si la case d'atterissage du joueur est une case contenant une arme?


        this.finirLeTour();
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
        //TODO: Gérer le cas du joueur B qui attaque.
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