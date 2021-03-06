function toggle() {
    let links = document.getElementById("links");
    let blob = document.getElementById("blob");
    blob.classList.toggle("open");
    if (links.style.display == "block") {
        links.style.display = "none";
    } else {
        links.style.display = "block";
    }
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function app() {
    return {
        month: '',
        year: '',
        no_of_days: [],
        blankdays: [],
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        initializePage,
        events: [
            // fill this in with habits
            // {
            // 	event_date: new Date(2020, 3, 1),
            // 	event_title: "April Fool's Day",
            // 	event_theme: 'blue'
            // },


        ],
        event_title: '',
        event_date: new Date(),
        // event_theme: '',

        // themes: [
        //     {
        //         value: "blue",
        //         label: "Blue Theme"
        //     },
        //     {
        //         value: "red",
        //         label: "Red Theme"
        //     },
        //     {
        //         value: "yellow",
        //         label: "Yellow Theme"
        //     },
        //     {
        //         value: "green",
        //         label: "Green Theme"
        //     },
        //     {
        //         value: "purple",
        //         label: "Purple Theme"
        //     }
        // ],

        openEventModal: false,

        initDate() {
            let today = new Date();
            this.month = today.getMonth();
            this.year = today.getFullYear();
            this.datepickerValue = new Date(this.year, this.month, today.getDate()).toDateString();
        },

        isToday(date) {
            const today = new Date();
            const d = new Date(this.year, this.month, date);

            return today.toDateString() === d.toDateString() ? true : false;
        },

        showEventModal(date) {
            // open the modal
            this.openEventModal = true;
            this.event_date = new Date(this.year, this.month, date).toDateString();
        },

        async addEvent() {
            // get all the habit checkboxes from the modal popup on the calendar
            const habitCheckboxes = document.getElementsByClassName("habit_checkbox");
            const triggerSelects = document.getElementsByClassName('triggerSelect');

            Array.from(document.querySelectorAll('.newtriggerinput')).forEach((trigger) => {
                if (trigger.value !== "") {

                    fetch("triggers", {
                        //need object id to put on the specific document
                        method: "put",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            trigger: trigger.value
                        })
                    })
                }
            })

            const habitData = [];

            // loop through all the checkboxes
            for (let i = 0; i < habitCheckboxes.length; i++) {
                console.log('triggerSelectsVal', triggerSelects[i].value)
                const triggerSelect = triggerSelects[i]
                // below is a variable for the current checkbox
                const habitCheckbox = habitCheckboxes[i];
                // adds the data for each checkbox
                habitData.push({ habit: habitCheckbox.value, didHabit: habitCheckbox.checked, reward: habitCheckbox.dataset.reward, cost: habitCheckbox.dataset.cost, trigger: triggerSelect.value })
            }
            // this 'newDate' converts the string version of date into a real date for storing in mongodb
            console.log(this.event_date, 'event date')
            const dataForServerDate = new Date(this.event_date)
            const queryString = dataForServerDate.getFullYear() + '-' + (dataForServerDate.getMonth() + 1) + '-' + dataForServerDate.getDate()
            let triggerDate = `https://mercuryretrogradeapi.com?date=${queryString}`
            console.log(triggerDate, 'date')
            let inRetrogradeStatus = await fetch(triggerDate)
                //.then gets called after the fetch gets done and completes data & converts it into a json object
                .then(res => res.json())
                // takes in the json object and we get to do what we want with that data
                .then(data => {
                    console.log('data', data)
                    return data.is_retrograde
                })
                .catch(err => {
                    alert("Error - couldn't find results, sorry!")
                })
            console.log(inRetrogradeStatus, 'in retrograde status')

            const dataForServer = {
                habits: habitData,
                inRetrograde: inRetrogradeStatus,
                date: dataForServerDate
            }
            console.log("addEvent: should send this data to the server in a fetch", dataForServer);
            setBackground(dataForServer)
            displayRewards(dataForServer)

            if (this.event_title == '') {
                return;
            }
            this.events.push({
                event_date: this.event_date,
                event_title: this.event_title,
                event_theme: this.event_theme
            });
            // clear the form data
            this.event_title = '';
            this.event_date = new Date();
            // this.event_theme = 'blue';
            // close the modal
            this.openEventModal = false;

        },


        getNoOfDays() {
            let daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

            // find where to start calendar day of week
            let dayOfWeek = new Date(this.year, this.month).getDay();
            let blankdaysArray = [];
            for (var i = 1; i <= dayOfWeek; i++) {
                blankdaysArray.push(i);
            }

            let daysArray = [];
            for (var i = 1; i <= daysInMonth; i++) {
                daysArray.push(i);
            }

            this.blankdays = blankdaysArray;
            this.no_of_days = daysArray;
        }
    }
}

// dynamically generating html that is the congrats and rewards page
function displayRewards(dataForServer) {

    let habitList = document.querySelector('.habitList')
    let habitButtons = document.querySelector('.habitButtons')
    habitButtons.classList.add('hideThis')
    habitList.classList.add('hideThis')
    let congrats = false
    //this is going to filter and put the didHabits into a new array
    let didHabits = dataForServer.habits.filter(habit => habit.didHabit === true)
    let ratio = Math.floor((didHabits.length / dataForServer.habits.length) * 100)
    if (ratio > 75) {
        document.querySelector('.congrats').innerText = `Look at you! This is your race at your pace. Because you refrained from ${ratio}% of all your habits, you have more options to reward yourself. Note: if you don't want rewards, leave the checkboxes empty.`
    }
    else if (ratio > 50) {
        document.querySelector('.congrats').innerText = `Good work! This is your race at your pace. Because you still refrained from ${ratio}% of all your habits, you still have some options for rewards today. Note: if you don't want rewards, leave the checkboxes empty.`
    }
    else if (ratio > 25) {
        document.querySelector('.congrats').innerText = `You're doing okay. This is your race at your pace. Because you still refrained from ${ratio}% of all your habits, you don't have as many options for rewards today. Note: if you don't want rewards, leave the checkboxes empty.`
    }
    else if (ratio === 0) {
        document.querySelector('.congrats').innerText = "Unfortunately, you did not refrain from any of your habits... Tommorrow is another day. Note: if you don't want rewards, leave the checkboxes empty."
    }
    else if (ratio === 100) {
        document.querySelector('.congrats').innerText = "Congratulations! This is your race at your pace. Because you refrained from all of your habits, you have the option to reward yourself plenty today. Note: if you don't want rewards, leave the checkboxes empty."
    }

    //create a for loop that is running conditional tests on the habitData array
    dataForServer.habits.forEach(habit => {
        if (habit.didHabit === true) {
            let rewardItem = document.createElement('li')
            // rewardItem.classList.add('')
            let rewardLabel = document.createElement('label')
            rewardLabel.classList.add('text-lg')
            document.querySelector('.rewardList').appendChild(rewardItem)
            let rewardCheckbox = document.createElement('input')
            rewardCheckbox.classList.add('m-2', 'form-checkbox', 'h-5', 'w-5', 'text-yellow-600', 'r-45')
            rewardCheckbox.classList.add('rewardCheckbox')
            rewardCheckbox.setAttribute('type', 'checkbox')
            rewardCheckbox.setAttribute('name', habit.reward)
            rewardLabel.innerText = habit.reward + ' ' + 'for refraining from:' + ' ' + habit.habit
            rewardItem.appendChild(rewardCheckbox)
            rewardItem.appendChild(rewardLabel)
            //move these so they arent in the li
        }
        else { }
    })

    let sendReward = document.createElement('button')
    sendReward.classList.add('sendRewardButton')
    sendReward.innerText = "reward myself"
    sendReward.classList.add('bg-gray-800', 'hover:bg-gray-700', 'text-white', 'font-semibold', 'py-2', 'px-4', 'border', 'border-gray-700', 'rounded-lg', 'shadow-sm')

    // let noReward = document.createElement('button')
    // noReward.innerText = "no reward today"
    // noReward.classList.add('bg-white', 'hover:bg-gray-100', 'text-gray-700', 'font-semibold', 'py-2', 'px-4', 'border', 'border-gray-300', 'rounded-lg', 'shadow-sm', 'mr-2')

    document.getElementById('rewards').appendChild(sendReward)
    // document.getElementById('rewards').appendChild(noReward)


    // next we are grabbing the data of which reward checkboxes were checked and store that in the db

    const rewardCheckboxes = document.getElementsByClassName('rewardCheckbox')

    // document.querySelector(".NoSendRewardButton").addEventListener('click', () => {
    //     window.location.reload(true);
    //     })

    document.querySelector(".sendRewardButton").addEventListener('click', (e) => {
        // e.preventDefault() // will prevent all default functionality that comes w the button
        const rewardData = [];
        // loop through all the checkboxes, for each reward checkbox we want to push reward info into the data array
        for (let i = 0; i < rewardCheckboxes.length; i++) {
            const rewardCheckbox = rewardCheckboxes[i];
            // adds the data for each checkbox
            rewardData.push({ reward: rewardCheckbox.getAttribute('name'), gaveReward: rewardCheckbox.checked })
        }
        //taking the object dataforserver and adding a key called rewarddata and then setting the value to reward data
        dataForServer.rewardData = rewardData

        const userEmail = document.getElementById('userEmail').value
        fetch("calendar", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                dataForServer: dataForServer,
                email: userEmail
            }),
        })
            .then((response) => {
                console.log('response=' + response)
                if (response.ok) return response.text();
            })
            .then((text) => {
                console.log('text=' + text)
                window.location.reload(true);
            });

    })
    // this 'newDate' converts the string version of date into a real date for storing in mongodb


}



//dataForServer contains habit name, reward name, date, and didHabit
function setBackground(dataForServer) {
    let streakDate
    let div = document.querySelectorAll('.calendarDate')
    let calendarMonth = document.querySelector('.calendarMonth')


    //chaning it from a string to the date type that .date needs
    let dateSelected = new Date(dataForServer.date)
    streakDate = Array.from(div).filter((diva) => {
        // console.log(MONTH_NAMES[dateSelected.getMonth()], 'test')
        // console.log(dateSelected.getMonth(), 'test2')
        // console.log(MONTH_NAMES, 'test3')
        // console.log(dateSelected, 'test4')
        if (calendarMonth.innerText == MONTH_NAMES[dateSelected.getMonth()]) {
            if (diva.innerText == dateSelected.getDate()) {
                return diva
            }
        }
    })

    //grab the number of true results within didHabit
    let didHabitCounter = 0
    let habitCounter = dataForServer.habits.length
    let scale = 255 / habitCounter
    let finalShadeNum = 300
    dataForServer.habits.forEach((habit) => {
        if (habit.didHabit === true) {
            didHabitCounter += 1
            finalShadeNum -= scale
        }
    })
    if (streakDate[0]) {
        streakDate[0].style.background = `rgb(0,0, 250, 0.${Math.floor(finalShadeNum)})`
    }

    let streakData = dataForServer.date

}

function updateBackground(month) {
    let div = document.querySelectorAll('.calendarDate')
    let streakDiv = document.getElementsByClassName('dataDiv')[0].innerText
    Array.from(div).forEach((date) => {
        date.style.background = `rgb(255,255,255)`
    })
    let streakJSON = JSON.parse(streakDiv)
    streakJSON.forEach(streak => {
        if (streak.dataForServer) {
            Array.from(div).forEach((date) => {
                let dateSelected = new Date(streak.dataForServer.date)
                if (month === dateSelected.getMonth()) {
                    if (date.innerText == dateSelected.getDate()) {
                        //grab the number of true results within didHabit
                        let didHabitCounter = 0
                        let habitCounter = streak.dataForServer.habits.length
                        let scale = 255 / habitCounter
                        let finalShadeNum = 300
                        streak.dataForServer.habits.forEach((habit) => {
                            if (habit.didHabit === true) {
                                didHabitCounter += 1
                                finalShadeNum -= scale
                            }
                        })
                        date.style.background = `rgb(0,0, 255, 0.${Math.floor(finalShadeNum)})`
                    }
                }
            })

        }
    })

}
function initializePage() {
    let streakDiv = document.getElementsByClassName('dataDiv')[0].innerText
    let streakJSON = JSON.parse(streakDiv)
    streakJSON.forEach(streak => {
        if (streak.dataForServer) {
            setBackground(streak.dataForServer)
        }
    })
}

setTimeout(initializePage, 100)


// function copyURI(evt) {
//     evt.preventDefault();
//     navigator.clipboard.writeText(window.location.origin + evt.target.getAttribute('href')).then(() => {
//         alert('url copied!')
//     }, () => {
//         /* clipboard write failed */
//     });
// }

// Get the button that opens the modal
let btn = document.querySelector('.share')

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal

function openWindow(evt) {
    tabSound.play()
    let modal = document.getElementById("myModal");
    var preview = document.querySelector('.preview')
    modal.style.display = "block";
    evt.preventDefault();
    navigator.clipboard.writeText(window.location.origin + evt.target.getAttribute('href')).then(() => {
    }, () => {
        /* clipboard write failed */
    });
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    let modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


// Get the button that opens the modal
let introButton = document.querySelector('#intro')

// Get the <span> element that closes the modal
let closeModal = document.getElementsByClassName("exit")[0];

// When the user clicks on the button, open the modal

function openIntro(evt) {
    tabSound.play()
    let intro = document.getElementById("introModal");
    intro.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function () {
    let intro = document.getElementById("introModal");
    intro.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    let intro = document.getElementById("introModal");
    if (event.target == intro) {
        intro.style.display = "none";
    }
}

function check(event) {

    console.log('event.target', event.target)
    let targetId = `trigger_popup_${event.target.dataset.habitid}`

    if (event.target.selectedIndex == 1) {
        document.getElementById(targetId).style.display = 'block';
        let triggerId = `trigger_input_${event.target.dataset.habitid}`
        console.log(triggerId, 'triggerId')
        let newTrigger = document.getElementById(triggerId).value
        console.log(newTrigger, ':newtrigger')

        fetch("triggers", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                trigger: newTrigger,
            })
        })

    } else {
        document.getElementById(targetId).style.display = 'none';
    }

}

var habitSound = document.getElementById("habitSound");
habitSound.loop = false
var tabSound = document.getElementById("tabSound");
tabSound.loop = false
var calendarSound = document.getElementById("calendarSound");
calendarSound.loop = false

function playTabSound() {
    tabSound.play()
}

function playSubmitSound() {
    habitSound.play()
}
function playCalendarSound() {
    calendarSound.play()
}

