const validateEmail = async (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return String(email).toLowerCase().match(emailRegex);
};

module.exports = validateEmail;
