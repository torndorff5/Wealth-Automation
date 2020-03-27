//using jshint: 6

exports.getDate = function () {
  const today = new Date();
  let day = today.getDay();
  const options = {
    day:"numeric",
    month:"numeric",
    year:"numeric"
  }
  return today.toLocaleDateString("fr-CA",options);
}
