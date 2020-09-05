class Weapon {
    constructor(nom,visuel, degats) {
        this.nom = nom;
        this.visuel = visuel
        this.degats = degats;
        this._proprietaire;
        this._coordonnees = {};
    }

    get coord() {
        return this._coordonnees;
    }
    set coord(value) {
        this._coordonnees = value;
        if (this._proprietaire)
            this._proprietaire.arme = undefined;
        this._proprietaire = undefined;
    }

    /* get estPortee() {
        return !!this._proprietaire;
    }

    get joueur() { 
        return this._proprietaire;
    } */
    set joueur(joueur) {
        this._proprietaire = joueur;
        this._coordonnees = {};
        joueur.arme = this;
    }

    toString() {
        return this.nom;
    }
}