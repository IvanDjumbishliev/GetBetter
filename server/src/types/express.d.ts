declare global {
  namespace Express {
    interface Request {
      /** Set by verifyAccessToken. */
      user?: { id: string; email: string };
    }
  }
}

export {};
