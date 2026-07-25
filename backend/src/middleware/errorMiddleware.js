const errorHandler = (
  err,
  req,
  res,
  next
) => {

  console.error(
    "ERROR:",
    err
  );


  /*
  Mongoose CastError
  */

  if (
    err.name ===
    "CastError"
  ) {

    return res.status(400).json({

      success: false,

      message:
        "Invalid resource ID",

    });

  }


  /*
  Mongoose ValidationError
  */

  if (
    err.name ===
    "ValidationError"
  ) {

    return res.status(400).json({

      success: false,

      message:
        "Database validation failed",

      errors:
        Object.values(
          err.errors
        ).map(
          (error) =>
            error.message
        ),

    });

  }


  /*
  Duplicate MongoDB key
  */

  if (
    err.code === 11000
  ) {

    return res.status(409).json({

      success: false,

      message:
        "Resource already exists",

    });

  }


  /*
  Custom status code
  */

  const statusCode =
    err.statusCode || 500;


  return res.status(
    statusCode
  ).json({

    success: false,

    message:
      statusCode === 500
        ? "Internal server error"
        : err.message,

  });

};


module.exports =
  errorHandler;