export const formatDateOnly = (date?: string | null) => {
  if (!date) return "—";

  const parts = date.substring(0, 10).split("-");

  if (parts.length !== 3) return "—";

  const [year, month, day] = parts;

  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  if (isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat("en-EG", {
    day: "numeric",
    month: "short",
    year:"numeric"
  }).format(parsedDate);
};
export const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};