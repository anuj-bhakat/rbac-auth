import User from './models/user.js';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import { Strategy as LocalStrategy } from 'passport-local';
import expressSession from 'express-session';

import recordsRoutes from './routes/recordsRoute.js';
import authRoutes from './routes/auth.js';


dotenv.config();
const app = express();

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {})
    .then(() => {
        console.log('MongoDB is connected.');
    })
    .catch(err => {
        console.log(err);
        process.exit(0);
});

const allowedOrigins = [
  process.env.ALLOWED_ORIGINS_1,
  process.env.ALLOWED_ORIGINS_2,
  process.env.ALLOWED_ORIGINS_3,
  process.env.ALLOWED_ORIGINS_4
].filter(Boolean);


app.use(cors({
  origin: (origin, callback) => {
    console.log('[CORS] Origin check:', origin); 
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

const sessionOption = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24,
    domain: process.env.COOKIE_DOMAIN || undefined // Add domain support
  }
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession(sessionOption));

app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Cookies:', req.headers.cookie);
  next();
});

app.use(passport.initialize());
app.use(passport.session()); 


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routers
app.use('/auth', authRoutes);
app.use('/records', recordsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));