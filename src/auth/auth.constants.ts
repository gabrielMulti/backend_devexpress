import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
    secret: process.env.SECRETAPI,
    expiresIn: process.env.TOKEN_EXPIRES
  };