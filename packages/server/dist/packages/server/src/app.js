import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import getBeans from './bean/getBeans.js';
import addBean from './bean/addBean.js';
import editBean from './bean/editBean.js';
import removeBean from './bean/removeBean.js';
import getGear from './gear/getGear.js';
import getProfile from './profile/getProfile.js';
import removeProfile from './profile/removeProfile.js';
import addRecipe from './recipe/addRecipe.js';
import getRecipes from './recipe/getRecipes.js';
import editRecipe from './recipe/editRecipe.js';
import removeRecipe from './recipe/removeRecipe.js';
import addGear from './gear/addGear.js';
import removeGear from './gear/removeGear.js';
import editGear from './gear/editGear.js';
import getBrews from './brews/getBrews.js';
import getInProgressBrews from './brews/getInProgressBrews.js';
import getRecentBrews from './brews/getRecentBrews.js';
import editBrew from './brews/editBrew.js';
import addBrew from './brews/addBrew.js';
import { seedDefaultRecipes } from './lib/seedDefaultRecipes.js';
import connection from './db/connection.js';
import seedDemo from './seedDemo/seedDemo.js';
import { sendWelcomeEmail } from '../../email/src/emails/sendWelcomeEmail.js';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
const { CLIENT_PORT } = process.env;
if (!CLIENT_PORT) {
    throw new Error('Missing required client port variable');
}
const app = express();
app.use(helmet());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.resolve(process.cwd(), 'packages/client/dist');
app.use(express.static(clientDist));
app.use((req, res, next) => {
    if (req.path.startsWith('/api'))
        return next();
    res.sendFile(path.resolve(clientDist, 'index.html'));
});
app.use(cors({
    origin: [
        process.env.CLIENT_URL ?? 'http://localhost:5173',
        'https://www.tervabrewed.com',
        'https://tervabrewed.com',
    ],
    credentials: true,
}));
// Rate limiters
// Auth limiter - 20 attempts per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
// General API limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5000,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Auth limiter applied first, then general limiter skips auth routes
// so requests never hit both limiters
app.use('/api/auth', authLimiter);
app.use('/api', (req, res, next) => {
    if (req.path.startsWith('/auth'))
        return next();
    apiLimiter(req, res, next);
});
// Auth routes
app.post('/api/auth/sign-up/email', express.json(), async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const result = await auth.api.signUpEmail({
            body: { name, email, password },
        });
        if (result?.user?.id) {
            await seedDefaultRecipes(connection, result.user.id).catch((err) => console.error('Seed error:', err));
            await sendWelcomeEmail(result.user.email).catch((err) => console.error('Welcome email error:', err));
        }
        // Sign in immediately so the session cookie gets set on the response
        const signInResult = await auth.api.signInEmail({
            body: { email, password },
            asResponse: true,
        });
        // Forward BetterAuth's response headers (including Set-Cookie) to the client
        signInResult.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json());
// App routes
app.use('/api/bean', addBean, editBean, getBeans, removeBean);
app.use('/api/gear', addGear, editGear, getGear, removeGear);
app.use('/api/profile', getProfile, removeProfile);
app.use('/api/brew', addBrew, editBrew, getInProgressBrews, getBrews);
app.use('/api/getrecentbrews', getRecentBrews);
app.use('/api/seeddemo', seedDemo);
app.use('/api/recipe', addRecipe, editRecipe, getRecipes, removeRecipe);
export default app;
//# sourceMappingURL=app.js.map