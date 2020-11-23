const isEmail = (data) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (data.match(regEx)) return true;
  else return false;
};

exports.validateEmail = (data) => {
  let errors = {};

  if (!isEmail(data)) {
    errors.email = "must be a valid email address";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
