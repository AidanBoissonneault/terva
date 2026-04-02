// Flavour Hues
// Imports the attached coffee-flavour-hues json
// and allows an access point for them

// CREATED ON: 01APR2026
// By: Aidan Boissonneault

import hues from './coffee-flavour-hues.json' assert { type: 'json' }

export function getFlavourHue(note: string): number | null {
  const key = note.toLowerCase().trim()

  // Exact match
  if (key in hues) return hues[key as keyof typeof hues]

  // Partial match — finds "black cherry" inside "black cherry jam"
  const match = Object.keys(hues).find(k => key.includes(k) || k.includes(key))
  return match ? hues[match as keyof typeof hues] : null
}

export function getFlavorHues(notes: string[]): Record<string, number | null> {
  return Object.fromEntries(notes.map(n => [n, getFlavourHue(n)]))
}
