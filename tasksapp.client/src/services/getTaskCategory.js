import { startOfWeek, endOfWeek, addDays, isToday, isTomorrow, isWithinInterval, isAfter } from 'date-fns';
import { ru } from 'date-fns/locale';

function getTaskCategory(date){
    const today = new Date();
    const tomorrow = addDays(today,1);
    const currentWeekStart = startOfWeek(today, {weekStartsOn: 1});
    const currentWeekEnd = endOfWeek(today, {weekStartsOn: 1});
    const nextWeekStart =  addDays(currentWeekEnd, 1 );
    const nextWeekEnd = endOfWeek(nextWeekStart, {weekStartsOn: 1});

    // if(isToday(date)){
    //     return "Сегодня";
    // }else if(isTomorrow(date)){
    //     return "Завтра";
    // }else if(isWithinInterval(date, {start: currentWeekStart, end: currentWeekEnd})){
    //     return "На этой неделе";
    // }else if(isWithinInterval(date, {start: currentWeekStart, end: currentWeekEnd}))
}   