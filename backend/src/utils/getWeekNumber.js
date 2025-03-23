function getWeekNumber(startDate, targetDate = new Date()){
    const start = new Date(startDate);
    const target = new Date(targetDate);
    
    start.setHours(0,0,0,0,);
    target.setHours(0,0,0,0,);

    const diffInDays = Math.floor((target - start)/ (1000 * 60 * 60 * 24));

    return Math.floor(diffInDays/7) + 1;
}

module.exports = {getWeekNumber};