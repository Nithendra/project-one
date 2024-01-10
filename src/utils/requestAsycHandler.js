// this will be HOC for hadling asyn call

const requestAsycHandler = (reqHandler) => {
  return (req, res, next) => {
    console.log("asyncHandler-middleware");
    Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
  };
};

export { requestAsycHandler };
