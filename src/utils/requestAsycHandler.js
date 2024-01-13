// this will be HOC for hadling asyn call

const requestAsycHandler = (reqHandler) => {
  return (req, res, next) => {
    Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
  };
};

export { requestAsycHandler };
