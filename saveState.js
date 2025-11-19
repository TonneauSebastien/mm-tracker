// saveState.js
// Fonctions pour sauvegarder et restaurer l'état du tracker via la variable globale Check

// Sauvegarde l'état actuel de Check dans le localStorage
function saveTrackerState() {
    if (typeof Check !== 'undefined') {
        localStorage.setItem('tracker_Check', JSON.stringify(Check));
        console.log('État sauvegardé (Check) :', Check);
    }
}

// Mapping direct nom interne => code 3 lettres
const InternalToShortCode = {
    bomb: "bom",
    bow: "bow",
    fire_arrow: "fir",
    ice_arrow: "ice",
    light_arrow: "lig",
    magic_bean: "bea",
    room_key: "roo",
    special_delivery: "spe",
    powder_keg: "pow",
    pictobox: "pic",
    lens: "len",
    hookshot: "hoo",
    great_fairy_sword: "gfs",
    letter_to_kafei: "let",
    pendant_of_memories: "pen",
    bottle: "bot",
    bottle_gold_dust: "gol",
    postmans_hat: "pos",
    allnight_mask: "all",
    blast_mask: "bla",
    stone_mask: "sto",
    greatfairy_mask: "gre",
    deku_mask: "dek",
    keaton_mask: "kea",
    bremen_mask: "bre",
    bunny_hood: "bun",
    dongero_mask: "don",
    mask_of_scents: "sce",
    goron_mask: "gor",
    romani_mask: "rom",
    circusleaders_mask: "cir",
    kafei_mask: "kaf",
    couples_mask: "cou",
    mask_of_truth: "tru",
    zora_mask: "zor",
    kamaro_mask: "kam",
    gibdo_mask: "gib",
    garo_mask: "gar",
    captains_hat: "cap",
    giants_mask: "gia",
    fiercedeity_mask: "fie",
    sword: "swo",
    mirror_shield: "mir",
    magic: "mag",
    wallet: "wal",
    song_of_healing: "soh",
    eponas_song: "epo",
    song_of_storms: "sos",
    sonata: "son",
    lullaby: "lul",
    nwbn: "nov",
    elegy: "ele",
    oath: "oat"
    // Ajoute ici d'autres correspondances si besoin
};

// Restaure l'état de Check à partir du localStorage
function loadTrackerState() {
    const saved = localStorage.getItem('tracker_Check');
    if (saved && typeof Check !== 'undefined') {
        const restored = JSON.parse(saved);

        // Restaure les inputs avec les codes de 3 lettres ou 'x' pour junk
        for (let key in restored) {
            if (restored.hasOwnProperty(key)) {
                if (restored[key] === 'junk') {
                    const inputElement = document.getElementById(key);
                    if (inputElement) {
                        inputElement.value = 'x';
                    }
                } else if (restored[key] !== 'unknown') {
                    const item = restored[key];
                    const baseItem = item.replace(/[0-9]+$/, ''); // Retire les suffixes numériques
                    const code = InternalToShortCode[baseItem];
                    if (code) {
                        const inputElement = document.getElementById(key);
                        if (inputElement) {
                            inputElement.value = code;
                        }
                    }
                }
            }
        }

        if (typeof Update === 'function') {
            Update(); // Rafraîchit l'UI selon la logique du projet
        }
        console.log('État restauré (Check) :', restored);
    }
}

// Pour utiliser :
// saveTrackerState(); // pour sauvegarder
// loadTrackerState(); // pour restaurer
