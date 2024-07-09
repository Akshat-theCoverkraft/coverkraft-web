import { parse, format } from 'date-fns';
export const formatDate = (dateString) => {
    try {
        const parsedDate = parse(dateString, "dd/MM/yyyy HH:mm:ss", new Date());
        return format(parsedDate, "dd/MM/yyyy");
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // Return original string if parsing fails
    }
};