const daysTillExpiration: number = 14;

export const OneWeekInMilliseconds: number = 7 * 24 * 60 * 60 * 1000;

export const calculateTimeUntilDeletion = (originalCreationDate: string): number => {
  const creationDate = new Date(originalCreationDate);
  const creationDatePlus2Weeks = new Date(originalCreationDate);
  creationDatePlus2Weeks.setDate(creationDate.getDate() + daysTillExpiration);

  const timeUntilDeletion = creationDatePlus2Weeks.getTime() - Date.now();
  return timeUntilDeletion;
};
