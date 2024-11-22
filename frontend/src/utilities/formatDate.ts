const formatDate = (date: Date | string): string => {
  const actualDate = typeof date === "string" ? new Date(date) : date;

  return `${padLeft(actualDate.getHours())}:${actualDate.getMinutes().toString().padStart(2, "0")} ${padLeft(
    actualDate.getDate()
  )}.${padLeft(actualDate.getMonth() + 1)}.${actualDate.getFullYear()}`;
};

const padLeft = (value: number): string => {
  return value.toString().padStart(2, "0");
};

export default formatDate;
