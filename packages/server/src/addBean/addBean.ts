// Add Beans API
// Adds beans to the sql database, and creates the colours.
// CREATED: 01APR2026
// BY: Aidan Boissonneault

// TODO:
// Make all colours outputted not the same.

import { Router } from 'express'
import connection from '../db/connection.js'
import type { ResultSetHeader } from 'mysql2'
import type { AddBeanForm, Bean } from '@terva/shared'

const router = Router()

function stringToHue(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    // Generate a unique numeric hash
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Use the modulo operator to get a value between 0 and 360
  // Math.abs ensures we don't get a negative degree
  return Math.abs(hash % 361)
}

// insert bean into
router.post<{}, { id: number } | { error: string }, AddBeanForm & { user: string}>('/', async (req, res) => {
  try {
    const {
      user,
      name,
      roaster,
      origin,
      variety,
      process,
      elevationM,
      roastLevel,
      state,
      flavourNotes,
    } = req.body

    const query = `
      INSERT INTO beans (
        user,
        name,
        roaster,
        origin,
        variety,
        process,
        elevation_m,
        roast_level,
        status,
        flavour_summary
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const [result] = await connection.query<ResultSetHeader>(query, [
      user,
      name,
      roaster,
      origin,
      variety,
      process,
      elevationM,
      roastLevel,
      state,
      flavourNotes,
    ])

    const beanId = result.insertId

    const flavourNote: string[] = (flavourNotes ?? '').split(',').map((note: string) => note.trim())

    const flavourHues = []
    for (let i = 0; i < (flavourNote.length > 3 ? 3 : flavourNote.length); i++) {
      flavourHues.push(stringToHue(flavourNote[i] ?? ""))
    }

    if (flavourHues.length === 0) {
      flavourHues.push(10)
    }

    while(flavourHues.length < 3) {
      flavourHues.push(flavourHues[0])
    }

 const colourQuery = `
  INSERT INTO bean_palette (
    bean_id,
    pri_hue,
    sec_hue,
    acc_hue
  )
  VALUES (?, ?, ?, ?)
 `

 const [resultColour] = await connection.query<ResultSetHeader>(colourQuery, [
  beanId,
  flavourHues[0],
  flavourHues[1],
  flavourHues[2],
 ])

    res.json({ id: beanId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
