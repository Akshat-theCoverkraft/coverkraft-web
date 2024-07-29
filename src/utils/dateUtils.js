import { parse, format } from 'date-fns';
import moment from 'moment';
export const formatDate = (dateString) => {
    try {
        const parsedDate = parse(dateString, "dd/MM/yyyy HH:mm:ss", new Date());
        return format(parsedDate, "dd/MM/yyyy");
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // Return original string if parsing fails
    }
};


export function dateformat(inputDate) {
    console.log('@------', inputDate);
    const desiredFormat = 'DD/MM/YYYY';
    
    // Check if the inputDate contains time and date, and remove the time part if it does
    const datePart = inputDate.split(' ')[0] ; // Split by space to get the date part
    const formattedDatePart = moment(datePart, 'DD/MM/YYYY', true);
    
    if (formattedDatePart.isValid()) {
        console.log('Correct format:', formattedDatePart.format(desiredFormat));
        return formattedDatePart.format(desiredFormat);
    } else {
        const date = moment(inputDate, 'DD/MM/YYYY HH:mm:ss');
        if (!date.isValid()) {
            // console.error('Invalid date provided:', inputDate);
            return null;
        }
        const formattedDate = date.format(desiredFormat);
        console.log('--*******', formattedDate);
        return formattedDate;
    }
}