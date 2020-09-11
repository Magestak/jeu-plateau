/**
 * Renvoi une case aléatoire, répondant aux critères du vérificateur passé en paramètre.
 * @param { (value: any) => boolean } verificateur
 * @returns { HTMLElement }
 */
function recupererCaseAleatoire(verificateur) {
    // Déclaration de la variable contenant les cases générées.
    let caseGeneree;

    do {
        // Récupération d'une case aléatoire
        caseGeneree = this.genererCasesAleatoires();
    } while (!verificateur(caseGeneree)); // On recommence tant que le vérificateur renvoit `false`.

    // On renvoi la case générée, répondant aux critères du vérificateur.
    return caseGeneree;
}

/**
 * Permet d'extraire sous la forme de "x" et "y" les coordonnées d'une cellule.
 * @param { HTMLElement } cellule
 * @return { { x: number, y: number } }
 */
function extraireCoordonneesId(cellule) {
    const coordsTableau = cellule.id.split('-').map(Number);
    return { x: coordsTableau[0], y: coordsTableau[1] };
}

/**
 * Renvoi `TRUE` si la `caseAVerifier` répond aux critères du `verificateur` (verificateur renvoi `TRUE`), sinon, renvoi false
 * @param { HTMLElement } caseAVerifier
 * @param { (cellule: HTMLElement, prev?: false | HTMLElement) => false | HTMLElement } verificateur
 * @returns { boolean }
 */
function verifierCasesAdjacentes(caseAVerifier, verificateur) {
    // On récupère les coordonnées de la case à vérifier
    const coords = extraireCoordonneesId(caseAVerifier);
        
    // On récupère les 4 cases "autour" de la case à vérifier
    return [
        $(`#${coords.x - 1}-${coords.y}`),
        $(`#${coords.x + 1}-${coords.y}`),
        $(`#${coords.x}-${coords.y - 1}`),
        $(`#${coords.x}-${coords.y + 1}`)
    ]
        .filter($cellule => $cellule.length > 0) // On enlève les cases inexistantes (de par la récupération "naïve" par coordonnées).
        .reduce(
            // Vérification "dynamique" (selon l'utilisation de la fonction) de la case actuellement vérifiée (renvoi TRUE ou FALSE).
            (prev, curr) => verificateur(curr[0], prev),
            false // Valeur initiale (vérification non-concluante, car inexistante avant d'avoir commencé à boucler sur les 4 cases).
        );
}