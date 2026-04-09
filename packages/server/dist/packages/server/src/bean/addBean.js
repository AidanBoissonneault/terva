import { Router } from 'express';
import connection from '../db/connection.js';
import {} from '@terva/shared';
import { getFlavourHue } from '@terva/shared';
import { requireAuth } from '../middleware/requireAuth.js';
const router = Router();
router.post('/', requireAuth, async (req, res) => {
    try {
        const userId = res.locals.user.id;
        const { name, roaster, origin, variety, process, elevationM, roastLevel, state, flavourNotes, } = req.body;
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
      `;
        const [result] = await connection.query(query, [
            userId,
            name,
            roaster,
            origin,
            variety,
            process,
            elevationM,
            roastLevel,
            state,
            flavourNotes,
        ]);
        const beanId = result.insertId;
        let flavourNote = (flavourNotes ?? '').split(',').map((note) => note.trim());
        if (flavourNote.length === 1 && flavourNote[0]) {
            flavourNote = (flavourNotes ?? '').split(' ').map((note) => note.trim());
        }
        const flavourHues = [];
        for (const note of flavourNote) {
            const hue = getFlavourHue(note);
            if (hue !== null)
                flavourHues.push(hue);
        }
        while (flavourHues.length < 3) {
            if (flavourHues.length === 0)
                flavourHues.push(10);
            const lastHue = flavourHues[flavourHues.length - 1];
            if (lastHue !== undefined)
                flavourHues.push(lastHue);
        }
        const colourQuery = `
        INSERT INTO bean_palette (
          bean_id,
          pri_hue,
          sec_hue,
          acc_hue
        )
        VALUES (?, ?, ?, ?)
      `;
        await connection.query(colourQuery, [
            beanId,
            flavourHues[0],
            flavourHues[1],
            flavourHues[2],
        ]);
        res.json({ id: beanId });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
export default router;
//# sourceMappingURL=addBean.js.map