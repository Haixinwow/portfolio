/* * * * * * * * * * * * * * * * * * * *\
 *               Module 4              *
 *      Calendar Helper Functions      *
 *                                     *
 *        by Shane Carr '15 (TA)       *
 *  Washington University in St. Louis *
 *    Department of Computer Science   *
 *               CSE 330S              *
 *                                     *
 *      Last Update: October 2017      *
\* * * * * * * * * * * * * * * * * * * */

/*  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
    "use strict";

    /* Date.prototype.deltaDays(n)
     * 
     * Returns a Date object n days in the future.
     */
    Date.prototype.deltaDays = function(n) {
        // relies on the Date object to automatically wrap between months for us
        return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
    };

    /* Date.prototype.getSunday()
     * 
     * Returns the Sunday nearest in the past to this date (inclusive)
     */
    Date.prototype.getSunday = function() {
        return this.deltaDays(-1 * this.getDay());
    };
}());

/** Week
 * 
 * Represents a week.
 * 
 * Functions (Methods):
 *	.nextWeek() returns a Week object sequentially in the future
 *	.prevWeek() returns a Week object sequentially in the past
 *	.contains(date) returns true if this week's sunday is the same
 *		as date's sunday; false otherwise
 *	.getDates() returns an Array containing 7 Date objects, each representing
 *		one of the seven days in this month
 */
function Week(initial_d) {
    "use strict";

    this.sunday = initial_d.getSunday();


    this.nextWeek = function() {
        return new Week(this.sunday.deltaDays(7));
    };

    this.prevWeek = function() {
        return new Week(this.sunday.deltaDays(-7));
    };

    this.contains = function(d) {
        return (this.sunday.valueOf() === d.getSunday().valueOf());
    };

    this.getDates = function() {
        var dates = [];
        for (var i = 0; i < 7; i++) {
            dates.push(this.sunday.deltaDays(i));
        }
        return dates;
    };
}

/** Month
 * 
 * Represents a month.
 * 
 * Properties:
 *	.year == the year associated with the month
 *	.month == the month number (January = 0)
 * 
 * Functions (Methods):
 *	.nextMonth() returns a Month object sequentially in the future
 *	.prevMonth() returns a Month object sequentially in the past
 *	.getDateObject(d) returns a Date object representing the date
 *		d in the month
 *	.getWeeks() returns an Array containing all weeks spanned by the
 *		month; the weeks are represented as Week objects
 */
function Month(year, month) {
    "use strict";

    this.year = year;
    this.month = month;

    this.nextMonth = function() {
        return new Month(year + Math.floor((month + 1) / 12), (month + 1) % 12);
    };

    this.prevMonth = function() {
        return new Month(year + Math.floor((month - 1) / 12), (month + 11) % 12);
    };

    this.getDateObject = function(d) {
        return new Date(this.year, this.month, d);
    };

    this.getWeeks = function() {
        var firstDay = this.getDateObject(1);
        var lastDay = this.nextMonth().getDateObject(0);

        var weeks = [];
        var currweek = new Week(firstDay);
        weeks.push(currweek);
        while (!currweek.contains(lastDay)) {
            currweek = currweek.nextWeek();
            weeks.push(currweek);
        }

        return weeks;
    };
}

// For our purposes, we can keep the current month in a variable in the global scope
var currentMonth = new Month(2023, 2); // Mar 2023

// Change the month when the "next" button is pressed
document.getElementById("next_month_btn").addEventListener("click", function(event) {
    currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    console.log("The new month is " + currentMonth.month + " " + currentMonth.year);
}, false);

// Change the month when the "prev" button is pressed
document.getElementById("prev_month_btn").addEventListener("click", function(event) {
    currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
    updateCalendar(); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    console.log("The new month is " + currentMonth.month + " " + currentMonth.year);
}, false);

// updates the calendar by creating the grid, adding each day of the month to the grid accordingly,
// adds events to the grid, and adds event listeners for each event's edit and delete buttons
function updateCalendar() {
    displayMonthAndYear();
    var weeks = currentMonth.getWeeks();

    let newCalendar = document.createElement('div');
    newCalendar.classList.add("calendar");
    newCalendar.setAttribute("id", "calendar");
    document.getElementById("ErrorMessage").innerHTML = "";

    //loop through weeks
    for (var w in weeks) {
        var days = weeks[w].getDates();
        // days contains normal JavaScript Date objects.

        //add the week to calendar
        let weekDiv = document.createElement('div');
        weekDiv.classList.add("week");

        //loop through days
        for (var d in days) {
            //create a day Div to add other elements into
            let dayDiv = document.createElement('div');
            dayDiv.classList.add("day");
            if (days[d].getMonth() != currentMonth.month) {
                dayDiv.classList.add("otherMonth");
            }
            let monthFormatted = days[d].getMonth() + 1;
            if (monthFormatted < 10) {
                monthFormatted = "0" + monthFormatted;
            }
            let dateFormatted = days[d].getDate();
            if (dateFormatted < 10) {
                dateFormatted = "0" + dateFormatted;
            }
            let idToAdd = days[d].getFullYear() + "-" + monthFormatted + "-" + dateFormatted;
            //year-month-day
            dayDiv.id = idToAdd;

            //create the date div (header in calendar box with date)
            let dateDiv = document.createElement('div');
            dateDiv.classList.add("date");
            dateDiv.innerText = dayText(days[d].getDay()) + " " + days[d].getDate();

            dayDiv.appendChild(dateDiv);


            //LOOP THROUGH A USER'S EVENTS TO ADD TO EACH DAY
            fetch("userevents.php", {
                    headers: { 'content-type': 'application/json' }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        data.events.forEach(element => {
                            if (element.date == dayDiv.id) {
                                //create event div
                                let eventDiv = document.createElement('div');
                                eventDiv.classList.add("event");

                                //create the time to add into the event
                                let timeDiv = document.createElement('div');
                                timeDiv.classList.add("time");
                                timeDiv.innerHTML = element.time;

                                //create the event name to add into the event
                                let nameDiv = document.createElement('div');
                                nameDiv.classList.add("eventName");
                                nameDiv.classList.add(element.tag);
                                nameDiv.innerHTML = element.title;

                                //create the edit button to put into the event
                                let editDiv = document.createElement('div');
                                editDiv.classList.add("editIcon");
                                editDiv.innerHTML = "✎";
                                editDiv.id = element.id + "-edit";

                                //create the delete button to put into the event
                                let deleteDiv = document.createElement('div');
                                deleteDiv.classList.add("deleteIcon");
                                deleteDiv.innerHTML = "🗑";
                                deleteDiv.id = element.id + "-delete";

                                //add all of the above to the event div
                                let groupDiv = document.createElement('div');
                                groupDiv.classList.add("groupIcon");
                                groupDiv.innerHTML = "🔗";
                                groupDiv.id = element.id + "-group";

                                eventDiv.appendChild(timeDiv);
                                eventDiv.appendChild(nameDiv);
                                eventDiv.appendChild(editDiv);
                                eventDiv.appendChild(deleteDiv);
                                eventDiv.appendChild(groupDiv);

                                //add the event to the day
                                dayDiv.appendChild(eventDiv);

                                //edit event eventlistener
                                document.getElementById(editDiv.id).addEventListener("click", function() {
                                    //we had to define the function here because
                                    //this is the only way that the function will pass the variable properly
                                    //otherwise the variable passed will become undefined
                                    const date = document.getElementById("eventDateInputEdit").value; // Get the date from the form
                                    const time = document.getElementById("eventTimeInputEdit").value; // Get the time from the form
                                    const text = document.getElementById("eventNameInputEdit").value; // Get the event info from the form
                                    const token = document.getElementsByName("token")[0].value;

                                    // Make a URL-encoded string for passing POST data:
                                    const data = { 'date': date, 'time': time, 'text': text, 'event_id': parseInt(editDiv.id), 'token': token };

                                    fetch("editevent.php", {
                                            method: 'POST',
                                            body: JSON.stringify(data),
                                            headers: { 'content-type': 'application/json' }
                                        })
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.success) {
                                                console.log(data);
                                                updateCalendar();
                                            } else {
                                                document.getElementById("ErrorMessage").innerHTML = data.message;
                                            }
                                        })
                                        .catch(err => console.error(err));
                                }, false);
                                //delete event eventlistener
                                document.getElementById(deleteDiv.id).addEventListener("click", function() {
                                    // we had to define the function here because
                                    // this is the only way that the function will pass the variable properly
                                    // otherwise the variable passed will become undefined
                                    const data = {
                                        'event_id': parseInt(deleteDiv.id)
                                    }
                                    fetch("delete.php", {
                                            method: 'POST',
                                            headers: { 'content-type': 'application/json' },
                                            body: JSON.stringify(data),
                                        })
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.success) {
                                                updateCalendar();
                                            } else {
                                                document.getElementById("ErrorMessage").innerHTML = data.message;
                                            }
                                        })
                                        .catch(err => console.error(err));
                                }, false);
                                document.getElementById(groupDiv.id).addEventListener("click", function() {
                                    //group event
                                    const recipient_name = document.getElementById("groupUsername").value; // Get the date from the form
                                    // const event_id = document.getElementById("groupEventId").value;
                                    const token = document.getElementsByName("token")[0].value;

                                    // Make a URL-encoded string for passing POST data:
                                    const data = { 'recipient_name': recipient_name, 'event_id': parseInt(groupDiv.id), 'token': token };

                                    fetch("groupEvent.php", {
                                            method: 'POST',
                                            body: JSON.stringify(data),
                                            headers: { 'content-type': 'application/json' }
                                        })
                                        .then(response => response.json())
                                        .then(data => {
                                            if (data.success) {
                                                console.log(data);
                                                updateCalendar();
                                            } else {
                                                console.log(data);
                                                document.getElementById("ErrorMessage").innerHTML = data.message;
                                            }
                                        })
                                        .catch(err => {
                                            console.error(err);
                                        });
                                }, false);
                            }
                        });
                    }
                })
                .catch(err => console.error(err));

            weekDiv.appendChild(dayDiv);
        }
        newCalendar.appendChild(weekDiv);
    }

    document.getElementById("calendar").replaceWith(newCalendar);
}

function dayText(day) {
    let days = ["SUN", "MON", "TUES", "WED", "THUR", "FRI", "SAT"];
    return days[day];
}

function monthText(month) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[month];
}

function displayMonthAndYear() {
    //set the year display
    document.getElementById("yearTitle").innerText =
        currentMonth.year;
    //set the month display
    document.getElementById("monthTitle").innerText =
        monthText(currentMonth.month);
}

updateCalendar();