// Functions to save and restore the tracker's state using the global Check variable

// Saves the current state of Check into localStorage
function saveTrackerState() {
    // Save options (mode, gossips, fairy eggs)
    if (typeof saveTrackerOptions === 'function') saveTrackerOptions();

    if (typeof Check === 'undefined')
        return;

    const peeked_Check = {};
    const checkCopy = {};

    // Shallow copy of Check
    for (let k in Check) {
        if (Object.prototype.hasOwnProperty.call(Check, k))
            checkCopy[k] = Check[k];
    }

    // For each key, if the associated input contains something, we treat it as "peeked"
    for (let key in checkCopy) {
        if (!Object.prototype.hasOwnProperty.call(checkCopy, key))
            continue;

        const el = document.getElementById(key);
        if (!el)
            continue;

        // ignore hidden inputs
        try {
            if (window.getComputedStyle && window.getComputedStyle(el).display === 'none')
                continue;
        } catch (e) {
            // in case of any error accessing computed style, fall back to element style
            if (el.style && el.style.display === 'none')
                continue;
        }

        const val = (el.value || '').trim();
        if (val.length > 0) {
            // Save the peeked value and mask the value in the Check copy
            peeked_Check[key] = val;
            checkCopy[key] = 'unknown';
        }
    }

    localStorage.setItem('tracker_Check', JSON.stringify(checkCopy));
    localStorage.setItem('tracker_peeked_Check', JSON.stringify(peeked_Check));

    // Save hint (hintInput, barren_inputs, woth_inputs)
    if (typeof saveTrackerHints === 'function') saveTrackerHints();

    showToast('State saved');
    console.log(checkCopy);
    console.log(peeked_Check);
}

// Save hint into localStorage
function saveTrackerHints() {
    const hints = {};
    const hintArea = document.getElementById('hintInput');
    if (hintArea && typeof hintArea.value !== 'undefined') {
        const v = (hintArea.value || '').trim();
        if (v.length > 0) hints['hintInput'] = v;
    }

    for (let i = 1; i <= 4; i++) {
        const id = 'barren_input' + i;
        const el = document.getElementById(id);
        if (el && typeof el.value !== 'undefined') {
            const v = (el.value || '').trim();
            if (v.length > 0) hints[id] = v;
        }
    }

    for (let i = 1; i <= 4; i++) {
        const id = 'woth_input' + i;
        const el = document.getElementById(id);
        if (el && typeof el.value !== 'undefined') {
            const v = (el.value || '').trim();
            if (v.length > 0) hints[id] = v;
        }
    }

    localStorage.setItem('tracker_hints', JSON.stringify(hints));
}

// Save tracker options into localStorage
function saveTrackerOptions() {
    const ids = ['settings_option', 'gossips_option', 'fairy_eggs_option'];
    const opts = {};
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && typeof el.value !== 'undefined') opts[id] = el.value;
    });
    localStorage.setItem('tracker_options', JSON.stringify(opts));
}

// Mapping from internal item names to 3-letter short codes
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
    oath: "oat",
    moons_tear: "moo",
    skull_token: "sku",
    heart_piece: "hea",
    heart_container: "hco",
    fairy: "fai",
    land_title_deed: "lan",
    swamp_title_deed: "swa",
    mountain_title_deed: "mou",
    ocean_title_deed: "oce"
};

// Restores the state of Check from localStorage
function loadTrackerState() {
    // Load and apply options before applying peeked inputs
    if (typeof loadTrackerOptions === 'function') loadTrackerOptions();

    const saved = localStorage.getItem('tracker_Check');
    if (saved && typeof Check !== 'undefined') {
        const restored = JSON.parse(saved);

        // Restore inputs with 3-letter codes or 'x' for junk
        for (let key in restored) {
            if (restored.hasOwnProperty(key)) {
                if (restored[key] === 'junk') {
                    const inputElement = document.getElementById(key);
                    if (inputElement) {
                        try {
                            if (window.getComputedStyle && window.getComputedStyle(inputElement).display === 'none')
                                continue;
                        } catch (e) {
                            if (inputElement.style && inputElement.style.display === 'none')
                                continue;
                        }
                        inputElement.value = 'x';
                    }
                } else if (restored[key] !== 'unknown') {
                    const item = restored[key];
                    const baseItem = item.replace(/[0-9]+$/, ''); // remove any trailing numbers
                    const code = InternalToShortCode[baseItem];
                    console.log('Restoring', key, 'with item', item, 'code', code);
                    if (code) {
                        const inputElement = document.getElementById(key);
                        if (inputElement) {
                            try {
                                if (window.getComputedStyle && window.getComputedStyle(inputElement).display === 'none')
                                    continue;
                            } catch (e) {
                                if (inputElement.style && inputElement.style.display === 'none')
                                    continue;
                            }
                            inputElement.value = code;
                        }
                    }
                }
            }
        }
        
        if (typeof Update === 'function'){
            Update(); // Refreshes the UI according to project logic
        }

        // Applies the saved peeked values (as if the user had entered them)
        const peekedRaw = localStorage.getItem('tracker_peeked_Check');
        if (peekedRaw) {
            try {
                const peeked = JSON.parse(peekedRaw);
                for (let pkey in peeked) {
                    if (!Object.prototype.hasOwnProperty.call(peeked, pkey))
                        continue;
                    const inputElement = document.getElementById(pkey);
                    if (!inputElement)
                        continue;
                    // ignore hidden inputs
                    try {
                        if (window.getComputedStyle && window.getComputedStyle(inputElement).display === 'none')
                            continue;
                    } catch (e) {
                        if (inputElement.style && inputElement.style.display === 'none')
                            continue;
                    }
                    inputElement.value = peeked[pkey];
                }
            } catch (e) {
                console.warn('Impossible de parser tracker_peeked_Check :', e);
            }
        }

        if (typeof Update === 'function') {
            Update(); // Refreshes the UI according to project logic
        }
    }

    // Load hints after restoring Check inputs
    if (typeof loadTrackerHints === 'function') loadTrackerHints();

    showToast('State loaded');
}

// Load tracker options from localStorage
function loadTrackerOptions() {
    const raw = localStorage.getItem('tracker_options');
    if (!raw) return;
    try {
        const opts = JSON.parse(raw);
        for (let id in opts) {
            if (!Object.prototype.hasOwnProperty.call(opts, id)) continue;
            const el = document.getElementById(id);
            if (el && typeof el.value !== 'undefined') el.value = opts[id];
        }
    } catch (e) {
        console.warn('Impossible de parser tracker_options :', e);
    }
}

// Load tracker hints from localStorage
function loadTrackerHints() {
    const raw = localStorage.getItem('tracker_hints');
    if (!raw) return;
    try {
        const hints = JSON.parse(raw);
        for (let id in hints) {
            if (!Object.prototype.hasOwnProperty.call(hints, id)) continue;
            const el = document.getElementById(id);
            if (!el) continue;
            try {
                if (window.getComputedStyle && window.getComputedStyle(el).display === 'none') continue;
            } catch (e) {
                if (el.style && el.style.display === 'none') continue;
            }
            el.value = hints[id];
        }
    } catch (e) {
        console.warn('Impossible de parser tracker_hints :', e);
    }
}

// Export the current state (stored keys) to a downloadable JSON file
function exportState() {
    saveTrackerState();
    const exportObj = {};
    const keys = ['tracker_Check', 'tracker_peeked_Check', 'tracker_options', 'tracker_hints'];
    keys.forEach(k => {
        const v = localStorage.getItem(k);
        if (v !== null) exportObj[k] = JSON.parse(v);
    });

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mm-tracker-state.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import the state from a JSON file selected by the user
function importStateFromFile(event) {
    const f = event.target.files && event.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const obj = JSON.parse(e.target.result);
            // write keys if present
            if (obj.tracker_Check) localStorage.setItem('tracker_Check', JSON.stringify(obj.tracker_Check));
            if (obj.tracker_peeked_Check) localStorage.setItem('tracker_peeked_Check', JSON.stringify(obj.tracker_peeked_Check));
            if (obj.tracker_options) localStorage.setItem('tracker_options', JSON.stringify(obj.tracker_options));
            if (obj.tracker_hints) localStorage.setItem('tracker_hints', JSON.stringify(obj.tracker_hints));

            // load into UI
            if (typeof loadTrackerState === 'function') loadTrackerState();
        } catch (err) {
            console.warn('Failed to import state file:', err);
        }
    };
    reader.readAsText(f);
}

// Simple toast notification
function showToast(message, duration = 1800) {
    try {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.right = '20px';
        toast.style.bottom = '20px';
        toast.style.background = 'rgba(0,0,0,0.8)';
        toast.style.color = 'white';
        toast.style.padding = '8px 12px';
        toast.style.borderRadius = '6px';
        toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        toast.style.zIndex = 9999;
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 180ms ease-in-out, transform 180ms ease-in-out';
        toast.style.transform = 'translateY(8px)';
        document.body.appendChild(toast);
        // force layout
        void toast.offsetWidth;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(8px)';
            setTimeout(() => { try { document.body.removeChild(toast); } catch (e) {} }, 220);
        }, duration);
    } catch (e) {
        // fallback to alert-less console
        console.log('Toast:', message);
    }
}
