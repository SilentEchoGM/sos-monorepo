const regex = new RegExp(
  /^.{2}([0-9]{2})-([0-9]{2})-([0-9]{2})(T)([0-9]{2}):([0-9]{2}):([0-9]{2}).+$/
);

const sanitizeDateForFilename = (date: Date = new Date()) =>
  date.toISOString().match(regex)?.slice(1).join("");
