class Map {
    constructor(nbLignes, nbColonnes, x, y, casesObstacles) {
        this.nbLignes = nbLignes;
        this.nbColonnes = nbColonnes;
        this.x = x;
        this.y = y;
        this.casesObstacles = casesObstacles;
    }
    // Méthode de génération d'une map vide
    genererMapVide() {
        // Création des lignes
        for (let i = 0; i < this.nbLignes; i++) {
            const trElt = document.createElement('tr');
            trElt.id = 'line-' + i;
            document.getElementById('gameMap').appendChild(trElt);
            
            // Création des cellules
            for (let j = 0; j < this.nbColonnes; j++) {
                const tdElt = document.createElement('td');
                tdElt.id = this.y + '-' + this.x;
                tdElt.classList.add("casesAccessibles"); // On ajoute la classe css "casesAccessibles"
                document.getElementById(`line-${this.y}`).appendChild(tdElt);
                this.x++; // Remplir vers la droite
        
                // Passer à la ligne
                if(document.getElementById(`line-${this.y}`).children.length == this.nbColonnes) {
                    this.y++; // On descend d'une ligne
                    this.x = 0; // On recommence à gauche
                }
            }  
        }    
    }
    // Méthode de génération de cases aléatoires pour les autres méthodes
    genererCasesAleatoires() {
        let cases = document.getElementsByTagName('td');
        let casesAleatoires = Math.floor(Math.random() * cases.length); // Calcul d'un nombre aléatoire
        return cases[casesAleatoires]; // Retourne une case aléatoire dans la grille
}
    // Méthode de génération des cases obstacles sur la map vide
    genererCasesObstacles() {
        for (let i = 0; i < this.casesObstacles; i++) {
            // On récupère une case aléatoire gràce à la méthode genererCasesAleatoires
            let caseNoire = this.genererCasesAleatoires();
            // Pour avoir le bon nombre de cases obstacles et pas de doublon
            if (caseNoire.classList.contains('casesObstacles')) {
                i--;
            } else {
                // On retire la classe css "casesAccessibles" à la case tirée aléatoirement
                caseNoire.classList.remove('casesAccessibles');
                // On attribue la classe css "casesObstacles" aux cases sélectionnées aléatoirement
                caseNoire.classList.add('casesObstacles');
            }
        }
    }
    // Méthode de positionnement des armes sur la map
    insererArmesMap(tableauArmes) {
        for (let i = 0; i < tableauArmes.length; i++) {
            // On récupère une case aléatoire gràce à la méthode genererCasesAleatoires
            let caseArme = this.genererCasesAleatoires();
            // Pour ne pas attribuer d'armes sur une case noire ou si une arme est déjà présente sur la case
            if (caseArme.classList.contains('casesObstacles') || (caseArme.classList.contains('casesArmes'))) {
                i--;
            } else {
                // On attribue la classe css "casesArmes" aux cases sélectionnées aléatoirement
                caseArme.classList.add('casesArmes');
                caseArme.innerHTML = tableauArmes[i].nom;
            }
        }
    }
    // Méthode de positionnement des joueurs sur la map
    insererJoueursMap(tableauJoueurs) {
        let distanceJoueur = 0; // Déclaration de la variable pour s'assurer de l'éloignement des 2 joueurs
        for (let i = 0; i < tableauJoueurs.length; i++) {
            let cases = document.getElementsByTagName('td');
            let casesAleatoires = Math.floor(Math.random() * cases.length); // Calcul d'un nombre aléatoire
            let caseJoueur = cases[casesAleatoires];
            // Si la case générée aléatoirement contient déjà un obstacle, une arme ou un joueur
            if ((caseJoueur.classList.contains('casesObstacles')) 
            || (caseJoueur.classList.contains('casesArmes')) 
            || (caseJoueur.classList.contains('casesJoueurs'))) {
                i--; // On recommence le calcul d'une case aléatoire
            } else {
                console.log(caseJoueur);
                let idJoueur = caseJoueur.id.split('-'); //TEST//////////////////////
                console.log(idJoueur); //TEST///////////////////////////
                // On attribue la classe css "casesJoueurs"
                caseJoueur.classList.add('casesJoueurs');
                caseJoueur.innerHTML = tableauJoueurs[i].nom;
                tableauJoueurs[i].coord = idJoueur.map(Number); //TEST//////////////////////
                console.log(tableauJoueurs[i].coord); //TEST/////////////////////
                // On calcule la distance entre les 2 cases joueurs
                distanceJoueur = casesAleatoires - distanceJoueur; // Utile pour le positionnement du 2ème joueur au 2ème tour de boucle
                if (i > 0) { // On teste le positionnement du 2ème joueur
                // Si la distance est inférieure à 12 cases
                    if ((Math.abs(distanceJoueur) <= 12)) {
                        // On vide la dernière case de son contenu et on efface la classe "casesJoueurs"
                        caseJoueur.innerHTML = "";
                        caseJoueur.classList.remove('casesJoueurs');
                        tableauJoueurs[i].coord = [];// TEST///////////////////////
                        // On annule le calcul de la distance avec cette case
                        distanceJoueur = casesAleatoires - distanceJoueur;
                        // On recommence le calcul d'une nouvelle case pour ce joueur
                        i--;
                    }    
                }
            }
        }
    }
}
