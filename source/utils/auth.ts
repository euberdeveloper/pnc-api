import * as passport from 'passport';
import { Handler, Request } from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as CustomStrategy, VerifiedCallback } from 'passport-custom';
import logger from 'euberlog';

import { authService, SerializedUser } from '@/services/auth.service';
import { InvalidCredentialsError, UserNotAuthenticatedError } from '@/errors';
import CONFIG from '@/config';

export const authenticateJwt: Handler = function authenticate(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    passport.authenticate('jwt', function (_error, user, info) {
        if (info) {
            logger.warning('Error in jwt authentication', info);
            const error = new UserNotAuthenticatedError();
            next(error);
        } else {
            req.login(user, err => {
                next(err);
            });
        }
    })(req, res, next);
};

export const authenticateLocal: Handler = function authenticate(req, res, next) {
    passport.authenticate('local', function (err, user, _info) {
        if (err) {
            const error = new InvalidCredentialsError();
            next(error);
        } else {
            req.login(user, err => {
                next(err);
            });
        }
    })(req, res, next);
};

export const authenticateLearnWorlds: Handler = function authenticate(req, res, next) {
    passport.authenticate('learnworlds', function (err, user, _info) {
        if (err) {
            const error = new InvalidCredentialsError();
            next(error);
        } else {
            req.login(user, err => {
                next(err);
            });
        }
    })(req, res, next);
};

export function initializePassport(): Handler {
    passport.serializeUser((user, done) => {
        const serializedUser = authService.serializeUser(user as any);
        done(null, serializedUser);
    });

    passport.deserializeUser((serializedUser: SerializedUser, done) => {
        authService
            .deserializeUser(serializedUser)
            .then(user => done(null, user))
            .catch(error => done(error));
    });

    passport.use(
        new LocalStrategy((username, password, done) => {
            async function authenticate() {
                const utente = await authService.verifyUsernameAndPassword(username, password);
                return utente;
            }

            authenticate()
                .then(user => done(null, user))
                .catch(error => done(error, null));
        })
    );

    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                algorithms: [CONFIG.SECURITY.JWT.ALGORITHM],
                secretOrKey: CONFIG.SECURITY.JWT.PUBLIC_PASSWORD,
                issuer: CONFIG.SECURITY.JWT.ISSUER
            },
            (jwtPayload, done) => {
                async function authenticate() {
                    const utente = await authService.verifyUserWithJwt(jwtPayload);
                    return utente;
                }

                authenticate()
                    .then(user => done(null, user))
                    .catch(error => done(error, null));
            }
        )
    );

    passport.use(
        'learnworlds',
        new CustomStrategy(function (req: Request, done: VerifiedCallback) {
            const authorization = req.headers.authorization;
            const apiToken = authorization?.split('Bearer ')?.[1] ?? null;
            const studentId = req.body.studentId;

            async function authenticate() {
                const student = await authService.verifyUserWithToken(apiToken, studentId);
                return student;
            }

            authenticate()
                .then(user => done(null, user))
                .catch(error => done(error, null));
        })
    );

    return passport.initialize();
}

export function initializeSession(): Handler {
    return passport.session();
}
