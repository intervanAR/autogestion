const supportsLS = supportsLocalStorage();
const memoryStorage = {};

export function setItem(name, value) {
    if (supportsLS) {
        window.localStorage.setItem(name, value);
    } else {
        memoryStorage[name] = value;
    }
}

export function getItem(name) {
    if (supportsLS) {
        return window.localStorage.getItem(name);
    } else {
        return memoryStorage[name];
    }
}
export function removeItem(name) {
    if (supportsLS) {
        return window.localStorage.removeItem(name);
    } else {
        delete memoryStorage[name];
    }
}

function supportsLocalStorage() {
    var mod = 'modernizr';
    try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch (e) {
        return false;
    }
}
