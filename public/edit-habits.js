console.log('hi')
let deleteButts = document.querySelectorAll('.delete')
deleteButts.forEach(button => {
    button.addEventListener('click', deleteHabit)
})

function deleteHabit(e) {
    console.log('accessed')
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
  
  function ding(e) {
    var textSound = document.getElementById("textSound");
    textSound.loop = false
  
    textSound.play()
  }