import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import asyncHandler from 'express-async-handler';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // console.log('token found');
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);

      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      //token error
      console.error(error);
      res.status(401);
      throw new Error('not authorised, token failed');
      //edit the token in postman to test
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('not authorised, no token');
  }

  next();
});

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);

    throw new Error('not authorised as an admin');
  }
};

export { protect, isAdmin };
