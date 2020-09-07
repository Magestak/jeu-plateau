const ETAT_INITIALISATION = 0;
const ETAT_DEPLACEMENT = 1;
const ETAT_COMBAT = 2;

class Game{
    constructor() {
        this.etat = ETAT_INITIALISATION;
        this.map = new Map(10, 10, 0, 0, 10); // création d'un nouvel objet avec la classe Map.
        this.armes;
        this.joueurs;
        this._indexJoueurActuel = 0;

        // Récupérer les boutons depuis leur ID.
        this.boutons = [{
            attaquer: $('#btnAttaqueJoueur0'),
            defendre: $('#btnDefenseJoueur0')
        }, {
            attaquer: $('#btnAttaqueJoueur1'),
            defendre: $('#btnDefenseJoueur1')
        }];
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

        // Insertion des armes dans la map.
        this.map.insererArmesMap(this.armes);

        // Insertion des joueurs dans la map.
        this.map.insererJoueursMap(this.joueurs);

        // Affichage des infos joueurs sur la page dans les parties réservées à chacun des joueurs.
        this.afficherInfosJoueurs(this.joueurs);

        // Utilisation du .bind pour garder le `this` lors de l'éxecution de la méthode `onCellClick`.
        $('td').each((idx, cellule) => cellule.addEventListener('click', this.onCellClick.bind(this)));

        // Initialisation des boutons `Attaquer` et `Se défendre` pour les joueurs.
        this.boutons.forEach(pair => {
            pair.attaquer.on('click', () => this.attaquer(this.joueurActuel, this.autreJoueur));
            pair.defendre.on('click', () => this.defendre(this.joueurActuel));
        });
    }
    
    get joueurActuel() {
        return this.joueurs[this.indexJoueurActuel];
    }
    get indexJoueurActuel() {
        return Number(this._indexJoueurActuel);
    }
    set indexJoueurActuel(idx) {
        this._indexJoueurActuel = idx;
    }
    get indexAutreJoueur() {
        return this.indexJoueurActuel === 0 ? 1 : 0;
    }
    get autreJoueur() {
        return this.joueurs[this.indexAutreJoueur];
    }

    /**
     * Débute la partie
     */
    demarrer() {
        this.etat = ETAT_DEPLACEMENT;
        this.joueurs[this.indexJoueurActuel].casesPossiblesDeplacement();
    }

    // Méthode pour la gestion de l'évènement "click" sur les cases.
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
        const nouvellePositionJoueur = extraireCoordonneesId(cellule);
        // On récupère la nouvelle case en fonction des nouvelles coordonnées.
        const $nouvelleCaseJoueur = $(`#${nouvellePositionJoueur.x}-${nouvellePositionJoueur.y}`);

        // On récupère les coordonnées de la case actuelle du joueur (avant déplacement).
        const positionActuelle = joueur.coord;
        // On récupère la case actuelle en fonction des coordonnées actuelles.
        const $caseActuelle = $(`#${positionActuelle.x}-${positionActuelle.y}`);
        
        // On efface la classe css de l'ancienne case joueur.
        $caseActuelle.removeClass('casesJoueurs');

        // Quand on part d'une case ou il y avait une arme (affichage de l'ancienne arme du joueur)
        if ($caseActuelle.hasClass('casesArmes')) {
            // Récupération de l'arme au sol
            const armePrecedente = this.armes.find(arme => arme.coord?.x === positionActuelle.x && arme.coord?.y === positionActuelle.y);
            // Affichage de l'arme au sol
            if (armePrecedente)
                $caseActuelle.html(armePrecedente.visuel);
        } else {
            // On efface le contenu de la case.
            $caseActuelle.html("");
            // Et on réattribue la classe css "casesAccessibles" à la case.
            $caseActuelle.addClass("casesAccessibles");
        }

        // On déplace le joueur sur la nouvelle case.
        joueur.coord = [nouvellePositionJoueur.x, nouvellePositionJoueur.y];

        // Si la nouvelle case joueur est aussi une case contenant une arme.
        if ($nouvelleCaseJoueur.hasClass('casesArmes')) {
            // Quand on arrive sur une case arme (échange des armes - non-visuel sur le plateau mais changement sur les côtés)
            const armeSuivante = this.armes.find(arme => arme.coord?.x === nouvellePositionJoueur.x && arme.coord?.y === nouvellePositionJoueur.y);
            if (armeSuivante) {
                const armeDropee = joueur.arme;
                // On remplace dans le tableau `this.armes` l'arme que va récupérer le joueur, par l'arme dont il était équipé.
                this.armes.splice(this.armes.indexOf(armeSuivante), 1, armeDropee);
                console.log("THIS.ARMES: ", this.armes);
                armeDropee.coord = nouvellePositionJoueur;
                console.log("ARME DROPEE.COORD: ", armeDropee.coord);
                armeSuivante.joueur = joueur;
                console.log("ARME SUIVANTE.JOUEUR: ", armeSuivante.joueur);
            }

            // On actualise la nouvelle arme dans les infos joueurs sur les côtés.
            $("#armeJoueur" + this.indexJoueurActuel).text(joueur.arme);
            $("#visuelArmeJoueur" + this.indexJoueurActuel).html(joueur.arme.visuel);
        }
        // Pour la nouvelle case joueur, on efface la classe css "casesAccessibles".
        $nouvelleCaseJoueur.removeClass('casesAccessibles');
        // Pour la nouvelle case joueur, on attribue la classe css "casesJoueur", et on insère le visuel du joueur.
        $nouvelleCaseJoueur.addClass('casesJoueurs').html(joueur.visuel);

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
            this.etat = ETAT_COMBAT; // On passe en état combat.
            // On affiche le message de début de combat.
            $('#debutCombat').css('display', 'block');
            // En activant le bouton, le message disparait et le combat commence.
            $('#combat').on('click', function () {
                $('#debutCombat').fadeOut('slow');
            });
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
        $('#visuelArmeJoueur0').html(this.joueurs[0].arme.visuel);
        $('#armeJoueur0').text(this.joueurs[0].arme.nom);
        $('#santeJoueur1').text(this.joueurs[1].sante);
        $('#visuelArmeJoueur1').html(this.joueurs[0].arme.visuel);
        $('#armeJoueur1').text(this.joueurs[1].arme.nom);
    }

    /**
     * Permet au joueur attaquant d'attaquer le joueur victime
     * @param { Player } attaquant Joueur qui attaque
     * @param { Player } victime Joueur qui EST attaqué
     */
    attaquer(attaquant, victime) {
        /* if (victime.bouclier)
            victime.sante = Math.max(victime.sante - attaquant.arme.degats / 2, 0);
        else
            victime.sante = Math.max(victime.sante - attaquant.arme.degats, 0);
        victime.bouclier = false;

        $("#santeJoueur" + this.indexAutreJoueur).text(victime.sante);

        if (victime.sante > 0)
            this.finirLeTour();
        else
            this.finirLaPartie(); */
        
            
        if (victime.bouclier === true)
            victime.sante -= attaquant.arme.degats / 2;
        else
            victime.sante -= attaquant.arme.degats;
        victime.bouclier = false;

        if (victime.sante > 0) {
            // On actualise la santé dans les infos joueurs sur les côtés.
            $("#santeJoueur" + this.indexAutreJoueur).text(victime.sante);
            this.finirLeTour();
        } else {
            // On met à jour la santé dans les infos des joueurs.
            if (victime.sante <= 0) {
                victime.sante = 0;
                $("#santeJoueur" + this.indexAutreJoueur).text(victime.sante);
            }
            this.finirLaPartie();
        }
    }

    /**
     * Permet au joueur de se défendre de la prochaine attaque
     * @param { Player } joueur
     */
    defendre(joueur) {
        joueur.bouclier = true;
        this.finirLeTour();
    }

    changerJoueur() {
        this.indexJoueurActuel = !this.indexJoueurActuel;
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
                this.changerJoueur();
                this.joueurs[this.indexJoueurActuel].casesPossiblesDeplacement();
                break;
            case ETAT_COMBAT:
                console.log("FIGHT CASE !");
                // Réactiver les boutons "Attaquer" et "Se défendre" pour les 2 joueurs
                this.changerJoueur();
                this.boutons.forEach((pair, idx) => {
                    pair.attaquer[0].disabled = idx === this.indexAutreJoueur;
                    pair.defendre[0].disabled = idx === this.indexAutreJoueur;
                });
                break;
        }
    }

    /**
     * Arrête la partie et propose de recommencer une partie ou de quitter le jeu
     */
    finirLaPartie() {
        // Affichage du bloc de fin de partie
        $('#finCombat').css('display', 'block');

        // Affichage du nom de vainqueur + message de félicitations.
        $('#messageResultat').html('Félicitations ' + this.joueurActuel + ' ! Tu remportes le combat !')

        // Rechargement de la page avec le bouton "recommencer".
        $('#recommencer').on('click', function () {
            document.location.reload(true);
        });

        // Effacement du contenu de la page et affichage d'un message d'au revoir avec le bouton "quitter"
        $('#quitter').on('click', function () {
            $('body').html("");
            // Création du message de fin.
            let $elemPFin = $('body').append("<p>Merci de votre visite et à bientôt !</p>");

            // Mise en place du CSS pour le message de fin.
            $elemPFin.css({
                "fontSize" : "36px",
                "textAlign" : "center",
                "paddingTop" : "100px",
                "paddingBottom" : "100px"
            });
        });
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
