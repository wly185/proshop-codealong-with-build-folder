const notFound = (req, res, next) => {
  //404 error
  const error = new Error(`not found = ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  //if 200 make it 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
  next();
};

export { notFound, errorHandler };
