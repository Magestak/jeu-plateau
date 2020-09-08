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

    // On renvoi la case générée, répondant aux critères du vérificateur
    return caseGeneree;
}

/**
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
    const coords = extraireCoordonneesId(caseAVerifier);

    return [
        $(`#${coords.x - 1}-${coords.y}`),
        $(`#${coords.x + 1}-${coords.y}`),
        $(`#${coords.x}-${coords.y - 1}`),
        $(`#${coords.x}-${coords.y + 1}`)
    ]
        .filter($cellule => $cellule.length > 0)
        .reduce((prev, curr) => verificateur(curr[0], prev), false);
}
