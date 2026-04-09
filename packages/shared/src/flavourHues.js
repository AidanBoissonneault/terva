// Flavour Hues
// Imports the attached coffee-flavour-hues json
// and allows an access point for them
// CREATED ON: 01APR2026
// By: Aidan Boissonneault
import hues from './coffee-flavour-hues-expanded.json' with { type: 'json' };
export function getFlavourHue(note) {
    const key = note.toLowerCase().trim();
    // Exact match
    if (key in hues)
        return hues[key];
    // Partial match ex: finds "black cherry" inside "black cherry jam"
    const match = Object.keys(hues).find(k => key.includes(k) || k.includes(key));
    return match ? hues[match] : null;
}
export function getFlavorHues(notes) {
    return Object.fromEntries(notes.map(n => [n, getFlavourHue(n)]));
}
