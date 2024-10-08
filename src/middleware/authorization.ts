import type { NextFunction, Request, Response } from 'express';

const { AUTHORIZATION } = process.env;

export default function authorization(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (AUTHORIZATION && req.headers.authorization !== `Basic ${AUTHORIZATION}`)
    return res
      .status(401)
      .json({
        message: 'unauthorized',
      })
      .end();

  next();
}
