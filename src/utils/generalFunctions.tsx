// Helper function to convert date from `DD/MM/YYYY` to `YYYY-MM-DD`
export const convertToISODate = (date: string): string => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`; 
};