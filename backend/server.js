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

// const corsOptions = {
//   origin: (origin, callback) => {
//     callback(null, true);
//   },
//   credentials: true,
// };
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    // 'https://rbac-frontend-abc123.vercel.app', 
    /\.vercel\.app$/ // Allow all Vercel subdomains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));

const sessionOption = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession(sessionOption));

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