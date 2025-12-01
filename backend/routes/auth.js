import express from 'express';
import passport from 'passport';

import { checkSession, loginUser, logout, registerUser, showAll } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login',
    passport.authenticate('local', {
        successMessage: 'loggedIn',
        failureMessage: 'failed',
        failureRedirect: '/auth/failed',
    }),
    loginUser
);

router.get('/showAll', showAll);
router.get('/failed', (req, res) => {
    res.status(401).json({ message: 'Authentication failed' });
});

router.get('/check-session', checkSession);
router.post('/logout', logout);

export default router;