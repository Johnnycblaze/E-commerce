const responseBody = (res, success, message, statusCode = 200, data = null) =>{
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

module.exports = responseBody;