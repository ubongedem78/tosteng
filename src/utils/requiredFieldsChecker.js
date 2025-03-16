const { BadRequestError } = require("../middlewares/errorhandler.middleware");

const checkRequiredFields = async (data, fieldDisplayNames) => {
  const requiredFields = Object.keys(fieldDisplayNames);
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    const errorMessage =
      missingFields.length === 1
        ? `${fieldDisplayNames[missingFields[0]]} is required`
        : `${missingFields
            .map((field) => fieldDisplayNames[field])
            .join(", ")} are required`;
    throw new BadRequestError(errorMessage);
  }
};

module.exports = checkRequiredFields;
