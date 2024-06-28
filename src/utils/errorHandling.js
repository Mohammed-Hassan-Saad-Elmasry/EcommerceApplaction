




export const asyncHandler = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch((error) => {
        return res.json({ message: error.message, stack: error.stack });
      });
    };
  };

  export const handelerror = (error, req, res, next) => {
    return res
      .status(error.cause || 400)
      .json({ ms: "g error", message: error.message });
  };
  