class Player {
    constructor(nom, sante, arme,) {
        this.nom = nom;
        //this.visuel = visuel; A RAJOUTER
        this.sante = sante;
        this.arme = arme;
        this._coordonnees = [];
    }
    set coord(value) {
        this._coordonnees = value;
    }
    get coord() {
        const coords = this._coordonnees;
        return {
            x: coords[1],
            y: coords[0]
        };
    }
}