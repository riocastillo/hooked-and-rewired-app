
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function app() {
    return {
        month: '',
        year: '',
        no_of_days: [],
        blankdays: [],
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

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

        // setClass() {
        //     console.log('accessed')
        //     const today = new Date();
        //     const d = new Date(this.year, this.month, date);

        //     return '' today.toDateString() === d.toDateString() ? true : false;
        // },

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
                habitData.push({ habit: habitCheckbox.name, didHabit: habitCheckbox.checked, reward: habitCheckbox.dataset.reward })
            }
            const dataForServer = {
                habits: habitData,
                date: new Date(this.event_date)
                // this 'newDate' converts the string version of date into a real date for storing in mongodb
            }
            console.log("addEvent: should send this data to the server in a fetch", dataForServer);

            setBackground(dataForServer)
            displayRewards(habitData)

            fetch("calendar", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dataForServer: dataForServer
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
            if (this.event_title == '') {
                return;
            }
            this.events.push({
                event_date: this.event_date,
                event_title: this.event_title,
                event_theme: this.event_theme
            });
            console.log(this.events);
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
function displayRewards(habitData) {
    let habitList = document.querySelector('.habitList')
    let habitButtons = document.querySelector('.habitButtons')
    habitButtons.classList.add('hideThis')
    habitList.classList.add('hideThis')
    document.querySelector('.congrats').innerText = 'Congratulations! This is your race at your pace. Because you did great today, you have the option to reward yourself.'

    //create a for loop that is running conditional tests on the habitData array
    habitData.forEach(habit => {
        let rewardItem = document.createElement('li')
        document.querySelector('.rewardList').appendChild(rewardItem)
        let rewardCheckbox = document.createElement('input')
        let sendReward = document.createElement('button')
        sendReward.innerText = "reward myself"
        let noReward = document.createElement('button')
        noReward.innerText = "no reward today"
        let habitList = document.querySelector('.habitList')
        habitList.appendChild(sendReward)
        habitList.appendChild(noReward)
        rewardCheckbox.setAttribute('type', 'checkbox')
        if (habit.didHabit === true) {
            rewardItem.innerText = habit.reward
            rewardItem.appendChild(rewardCheckbox)
        }

        // to do: 
        // - figure out how to get style of reward page to look like the previous one
        // - append two buttons at the rewards page 
        //         1 - reward myself
        //         2 - no rewards today
        // - add the didHabits to this page   
        //     - ex. "unengaged habit: x, available reward for this: "
        // - document the rewards in the database
        // - get the color boxes to stay up \  send info to the database
        
    }
    )


    // next we want to grab the data of which reward checkboxes were checked and store that in the db
    //create a new post to the db that documents when the user took these specific rewards

    //  const rewardCheckboxes = document.getElementsByClassName("reward_checkbox");
    //         const rewardData = [];
    //         // loop through all the checkboxes
    //         for (let i = 0; i < habitData.length; i++) {
    //             const rewardCheckbox = rewardCheckboxes[i];
    //             // adds the data for each checkbox
    //             habitData.push({ habit: habitCheckbox.name, didHabit: habitCheckbox.checked })
    //         }
    //         const dataForServer = {
    //             habits: habitData,
    //             date: new Date(this.event_date) 
    // this 'newDate' converts the string version of date into a real date for storing in mongodb

}
//dataForServer contains habit name, reward name, date, and didHabit
function setBackground(dataForServer){
    console.log('dataForServer.date'+ dataForServer.date.getDate())

    let div = document.querySelectorAll('.calendarDate')
    let streakDate = Array.from(div).reduce((diva, divb) => {
        console.log(diva)
        if(diva.innerText == dataForServer.date.getDate()){
            return diva
        }
        else{
            return divb
        }
    })
console.log('streakDate: ' + streakDate)

//grab the number of true results within didHabit
let didHabitCounter = 0
let habitCounter = dataForServer.habits.length
let scale = 255/habitCounter
let finalShadeNum = 300
dataForServer.habits.forEach((habit) => {
    if(habit.didHabit === true){
        didHabitCounter += 1
        finalShadeNum -= scale 
    }
})
streakDate.style.background = `rgb(0,0, 255, 0.${Math.floor(finalShadeNum)})`
console.log(`rgb(0,${Math.floor(finalShadeNum)},0)`)
console.log('counter: ' + didHabitCounter)
console.log('scale: ' + scale)
console.log('finalshadenum: ' + finalShadeNum)
}
//using rgb values we are going to assign the numbers to different shades on the rgb scale
//do math: didHabitCounter out of habitCounter total 
// create scale 
// first level is if the didHabitCounter was 25 and the habitCounter was 100
//second level is if the didHabitCounter was 50 and the habitCounter was 100
//third level is if the didHabitCounter was 75 and the habitCounter was 100


// document.getElementById('other').addEventListener('click', showResources)
// document.getElementById('contact').addEventListener('click', showContact)
// document.getElementById('results').addEventListener('click', showResults)
// document.getElementById('mission').addEventListener('click', showMission)

// function showMission() {
//     console.log('mission')
//     let form = document.querySelector('.hide')
//     form.style.display = 'none'
//     const mission = document.createElement('h3')
//     mission.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
//     document.querySelector('div').appendChild(mission)
// }


// function showResources() {
//     console.log('showing other resources')
//     let form = document.querySelector('.hide')
//     form.style.display = 'none'
//     const resources = document.createElement('h3')
//     resources.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
//     document.querySelector('div').appendChild(resources)
// }

// function showContact() {
//     console.log('contact us form')
//     let form = document.querySelector('.hide')
//     form.style.display = 'none'
//     const contact = document.createElement('h3')
//     contact.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
//     document.querySelector('div').appendChild(contact)
// }

// function showResults() {
//     console.log('show results')
//     let form = document.querySelector('.hide')
//     form.style.display = 'none'

// }
