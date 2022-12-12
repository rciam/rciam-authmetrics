export function convertDateByGroup(jsDate, groupBy) {
    var month = (jsDate.getMonth() + 1).toString()
    if (month.length < 2) {
        month = '0' + month;
    }
    var day = jsDate.getDate().toString()
    if (day.length < 2) {
        day = '0' + day;
    }
    if (groupBy == 'day') {
        var showDate = jsDate.getFullYear() + '-' + month + '-' + day;
    }
    else if (groupBy == 'week') {
        var showDate = jsDate.getFullYear() + '-' + month + '-' + day;
        var nextWeek = new Date(jsDate.setDate(jsDate.getDate() + 6));
        month = (nextWeek.getMonth() + 1).toString()
        if (month.length < 2) {
            month = '0' + month;
        }
        day = nextWeek.getDate().toString()
        if (day.length < 2) {
            day = '0' + day;
        }
        showDate += " to " + nextWeek.getFullYear() + '-' + month + '-' + day;
    }
    else if (groupBy == 'month') {
        var showDate = jsDate.getFullYear() + '-' + month;
    }
    else if (groupBy == 'year') {
        var showDate = jsDate.getFullYear();
    }
    return showDate;
}

export function getWeekNumber(d) {
    
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    return weekNo + ' (' + d.getUTCFullYear() + ')';
}

// Sort data and convert them to html list
export function convertToList(data, seperator) {
    var lis = ''
    data.split(seperator).sort(function (a, b) {
        var nameA = a.toUpperCase(); // ignore upper and lowercase
        var nameB = b.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // names must be equal
        return 0;
        
    }).forEach(function (value) {
        lis += '<li>' + value.trim() + '</li>'
    })
    return lis
}