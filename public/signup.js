const switchers = [...document.querySelectorAll('.switcher')]

switchers.forEach(item => {
	item.addEventListener('click', function() {
		switchers.forEach(item => item.parentElement.classList.remove('is-active'))
		this.parentElement.classList.add('is-active')
	})
})


function toggle () {
    let links = document.getElementById("links");
    let blob = document.getElementById("blob");
    blob.classList.toggle("open");
    if(links.style.display == "block") {
      links.style.display = "none";
    } else {
      links.style.display = "block";
    }
  };
  