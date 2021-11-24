console.log('hi')

document.querySelector('.delete').addEventListener('click', deleteHabit)

function deleteHabit(e) {
    let habitId = e.currentTarget.dataset.name

    fetch('deleteHabit', {
        method: "delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            habitId: habitId,
        })
    })
        .then((response) => {
            console.log('response=' + response)
            if (response.ok) return response.text();
        })
        .then((text) => {
            console.log('text=' + text)
            window.location.reload(true);
        });

}
