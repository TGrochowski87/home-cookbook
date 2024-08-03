const formatDate = (date: Date | string): string => {
  const actualDate = typeof date === "string" ? new Date(date) : date;

  return `${actualDate.getHours().toString().padStart(2, "0")}:${actualDate
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${actualDate.getDate()}.${actualDate.getMonth() + 1}.${actualDate.getFullYear()}`;
};

export default formatDate;
