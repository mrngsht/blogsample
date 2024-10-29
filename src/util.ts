export const formatDate = (d: Date): string => {
  const year = d.getFullYear()
  const month = d.getMonth()
  const date = d.getDate()
  return `${year}.${month}.${date}`
};

