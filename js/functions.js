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
    } while (!verificateur(caseGeneree)); // On recommence tant que le verificateur renvoit `true`

    // On renvoi la case générée, répondant aux critères du vérificateur
    return caseGeneree;
}

/**
 * Renvoi `TRUE` si la `caseAVerifier` répond aux critères du `verificateur` (verificateur renvoi `TRUE`), sinon, renvoi false
 * @param { HTMLElement } caseAVerifier
 * @param { (coords: { x: number, y: number }) => boolean } verificateur
 * @returns { boolean }
 */
function verifierCasesAdjacentes(caseAVerifier, verificateur) {
    const coords = caseAVerifier.id.split('-').reduce((prev, curr, idx) => {
        if (idx === 0)
            return { ...prev, x: Number(curr) };
        if (idx === 1)
            return { ...prev, y: Number(curr) };
    }, {});

    return verificateur(coords, caseAVerifier);
}