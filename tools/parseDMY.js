export default parseDMY = (dateString) => {
  const [day, month, year] = dateString.split("/");
  return new Date(year, month - 1, day);
};
