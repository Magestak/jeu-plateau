class Weapon {
    constructor(nom, visuel, degats) {
        this.nom = nom;
        this.visuel = visuel
        this.degats = degats;
        this._proprietaire;
        // Coordonnées au sol, privée car on a un getter/setter pour cette propriété.
        this._coordonnees = {};
    }

    get coord() {
        return this._coordonnees;
    }

    // Si on défini des coordonnées à une arme, c'est pour la déposer au sol, et dans ce cas,
    // on doit dire à son ancien propriétaire, qu'il n'a plus cette arme en main.
    set coord(value) {
        // On définit les coordonnées au sol de l'arme.
        this._coordonnees = value;
        // Si l'arme était dans la main d'un joueur auparavant.
        if (this._proprietaire)
            this._proprietaire.arme = undefined; // On enlève l'arme des mains du propriétaire.
        // On spécifie, pour cette arme, qu'elle n'est pas dans la main d'un joueur.
        this._proprietaire = undefined;
    }

    // Place l'arme dans la main du joueur donné.
    set joueur(joueur) {
        // On définit le joueur qui est propriétaire de l'arme.
        this._proprietaire = joueur;
        // On supprime les coordonnées "au sol" de l'arme, vu qu'elle n'est plus au sol.
        this._coordonnees = {};
        // On place l'arme dans les mains du joueur.
        joueur.arme = this;
    }

    toString() {
        return this.nom;
    }
}