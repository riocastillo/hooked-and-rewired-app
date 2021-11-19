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
        event_date: '',
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

        addEvent() {
            // if (this.event_title == '') {
            // 	return;

            // get all the habit checkboxes from the modal popup on the calendar
            const habitCheckboxes = document.getElementsByClassName("habit_checkbox");
            const habitData = [];
            // loop through all the checkboxes
            for (let i = 0; i < habitCheckboxes.length; i++) {
                // below is a variable for the current checkbox
                const habitCheckbox = habitCheckboxes[i];
                // adds the data for each checkbox
                habitData.push({ habit: habitCheckbox.value, didHabit: habitCheckbox.checked, reward: habitCheckbox.dataset.reward, cost: habitCheckbox.dataset.cost })
            }
            console.log(habitData.cost, 'test', Number(habitData.cost))
            const dataForServer = {
                habits: habitData,
                date: new Date(this.event_date)
                // this 'newDate' converts the string version of date into a real date for storing in mongodb
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
            this.event_date = '';
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
        document.querySelector('.congrats').innerText = `Look at you! This is your race at your pace. Because you refrained from ${ratio}% of all your habits, you have more options to reward yourself.`
    }
    else if (ratio > 50) {
        document.querySelector('.congrats').innerText = `Good work! This is your race at your pace. Because you still refrained from ${ratio}% of all your habits, you still have some options for rewards today.`
    }
    else if (ratio > 25) {
        document.querySelector('.congrats').innerText = `You're doing okay. This is your race at your pace. Because you still refrained from ${ratio}% of all your habits, you don't have as many options for rewards today.`
    }
    else if (ratio === 0) {
        document.querySelector('.congrats').innerText = 'Unfortunately, you did not refrain from any of your habits... Tommorrow is another day.'
    }
    else if (ratio === 100) {
        document.querySelector('.congrats').innerText = 'Congratulations! This is your race at your pace. Because you refrained from all of your habits, you have the option to reward yourself plenty today.'
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

        // to do: 
        // - document the rewards in the database
        // - get the color boxes to stay up \  send info to the database
    })

    let sendReward = document.createElement('button')
    sendReward.classList.add('sendRewardButton')
    sendReward.innerText = "reward myself"
    sendReward.classList.add('bg-gray-800', 'hover:bg-gray-700', 'text-white', 'font-semibold', 'py-2', 'px-4', 'border', 'border-gray-700', 'rounded-lg', 'shadow-sm')

    let noReward = document.createElement('button')
    noReward.innerText = "no reward today"
    noReward.classList.add('NoSendRewardButton')
    noReward.classList.add('bg-white', 'hover:bg-gray-100', 'text-gray-700', 'font-semibold', 'py-2', 'px-4', 'border', 'border-gray-300', 'rounded-lg', 'shadow-sm', 'mr-2')

    document.getElementById('rewards').appendChild(sendReward)
    document.getElementById('rewards').appendChild(noReward)


    // next we are grabbing the data of which reward checkboxes were checked and store that in the db

    const rewardCheckboxes = document.getElementsByClassName('rewardCheckbox')

    document.querySelector(".sendRewardButton").addEventListener('click', () => {
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
            //to do: figure out why the window is not reloading, and what the server is sending back as a response
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

    //chaning it from a string to the date type that .date needs
    let dateSelected = new Date(dataForServer.date)
    streakDate = Array.from(div).reduce((diva, divb) => {
        if (diva.innerText == dateSelected.getDate()) {
            return diva
        }
        else {
            return divb
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
    streakDate.style.background = `rgb(0,0, 255, 0.${Math.floor(finalShadeNum)})`

    let streakData = dataForServer.date

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

//changing innertext of the main box
document.getElementById('other').addEventListener('click', showResources)
function showResources() {
    document.querySelector('.welcomeTo').innerText = 'Additional Resources to Support Yourself in This Journey'
    document.querySelector('.welcomeTo').classList.add('text-xl')
    let form = document.querySelector('.replace')
    form.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
}

document.getElementById('mission').addEventListener('click', showMission)
function showMission() {
    document.querySelector('.welcomeTo').innerText = 'What Is Hooked & Rewired?'
    document.querySelector('.welcomeTo').classList.add('text-xl')
    let form = document.querySelector('.replace')
    form.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
}


function copyURI(evt) {
    evt.preventDefault();
    navigator.clipboard.writeText(window.location.origin + evt.target.getAttribute('href')).then(() => {
        alert('url copied!')
    }, () => {
        /* clipboard write failed */
    });
}