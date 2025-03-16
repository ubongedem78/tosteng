class ResponseHandler {
  static success(res, data, statusCode = 200, message) {
    const responseObject = {
      timestamp: new Date().toISOString(),
      success: true,
      status: statusCode,
      data: data,
    };

    if (message) {
      responseObject.message = message;
    }

    res.status(statusCode).json(responseObject);
  }
}

module.exports = { ResponseHandler };
