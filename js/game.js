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

        // Utilisation du .bind pour garder le `this` lors de l'éxecution de la méthode `clickCellule`.
        // idx inutile, il est présent uniquement pour avoir accès au 2ème paramètre "cellule".
        $('td').each((idx, cellule) => cellule.addEventListener('click', this.clickCellule.bind(this)));

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
        return this._indexJoueurActuel;
    }
    set indexJoueurActuel(idx) {
        // On utilise Number() à cause de la ligne 229 (`changerJoueur`) qui fournit un "boolean" au lieu d'un "number".
        this._indexJoueurActuel = Number(idx);
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

    /**
     * Permet de gérer l'évènement "click" sur les cases pour les déplacements
     * @param event
     */
    clickCellule(event) {
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

        // Quand on part d'une case ou il y avait une arme (affichage de l'ancienne arme du joueur).
        if ($caseActuelle.hasClass('casesArmes')) {
            // Récupération de l'arme au sol.
            const armePrecedente = this.armes.find(arme => arme.coord?.x === positionActuelle.x && arme.coord?.y === positionActuelle.y);
            // Affichage de l'arme au sol.
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
            // Quand on arrive sur une case arme (échange des armes - non-visuel sur le plateau mais changement sur les côtés).
            const armeSuivante = this.armes.find(arme => arme.coord?.x === nouvellePositionJoueur.x && arme.coord?.y === nouvellePositionJoueur.y);
            if (armeSuivante) {
                const armeDeposee = joueur.arme;
                // On remplace dans le tableau `this.armes` l'arme que va récupérer le joueur, par l'arme dont il était équipé.
                this.armes.splice(this.armes.indexOf(armeSuivante), 1, armeDeposee);
                armeDeposee.coord = nouvellePositionJoueur;
                armeSuivante.joueur = joueur;
            }

            // On actualise la nouvelle arme dans les infos joueurs sur les côtés.
            $("#armeJoueur" + this.indexJoueurActuel).text(joueur.arme);
            $("#visuelArmeJoueur" + this.indexJoueurActuel).html(joueur.arme.visuel);
        }
        // Pour la nouvelle case joueur, on efface la classe css "casesAccessibles".
        $nouvelleCaseJoueur.removeClass('casesAccessibles');
        // Pour la nouvelle case joueur, on attribue la classe css "casesJoueurs", et on insère le visuel du joueur.
        $nouvelleCaseJoueur.addClass('casesJoueurs').html(joueur.visuel);

        // Vérifier si un autre joueur (joueurB) est collé à `joueur`.
        const joueurPotentiel = verifierCasesAdjacentes(
            $nouvelleCaseJoueur[0],
            (cellule, prev) => {
                // Si prev vaut TRUE, on renvoi TRUE
                if (prev) return true;

                // Renvoi true si la case vérifiée est une "casesJoueurs".
                return cellule.classList.contains("casesJoueurs");
            }
        );

        // Si un joueur est trouvé dans les cases adjacentes
        if (joueurPotentiel) {
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
        if (victime.bouclier)
            victime.sante = Math.max(victime.sante - attaquant.arme.degats / 2, 0);
        else
            victime.sante = Math.max(victime.sante - attaquant.arme.degats, 0);
        victime.bouclier = false;

        // On actualise la santé dans les infos joueurs sur les côtés.
        $("#santeJoueur" + this.indexAutreJoueur).text(victime.sante);

        if (victime.sante > 0)
            this.finirLeTour();
        else
            this.finirLaPartie();
    }

    /**
     * Permet au joueur de se défendre de la prochaine attaque
     * @param { Player } joueur
     */
    defendre(joueur) {
        joueur.bouclier = true;
        this.finirLeTour();
    }

    /**
     * Permet de changer de joueur
     */
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
                // Appel à "finirLeTour" lorsque la game est en initialisation (case ETAT_INITIALISATION)
                // OU dans un état inconnu (default case).
                console.log("DEFAULT CASE !");
                break;
            case ETAT_DEPLACEMENT:
                this.changerJoueur();
                this.joueurs[this.indexJoueurActuel].casesPossiblesDeplacement();
                break;
            case ETAT_COMBAT:
                console.log("FIGHT CASE !");
                // On change de joueur
                this.changerJoueur();

                // Pour chaque "paire" de boutons (1 paire par joueur)
                this.boutons.forEach((pair, idx) => {
                    // On désactive les boutons si ceux-ci font partie de l'objet "pair"
                    // qui correspond au joueur dont le tour est terminé.
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
        // Affichage du bloc de fin de partie.
        $('#finCombat').css('display', 'block');

        // Affichage du nom de vainqueur + message de félicitations.
        $('#messageResultat').html('Félicitations ' + this.joueurActuel + ' ! Tu remportes le combat !')

        // Rechargement de la page avec le bouton "recommencer".
        $('#recommencer').on('click', function () {
            document.location.reload(true);
        });

        // Effacement du contenu de la page et affichage d'un message d'au revoir avec le bouton "quitter".
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
