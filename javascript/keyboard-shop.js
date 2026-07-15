const shop_list = [
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable1", 
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable2", 
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable3",
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable4",
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable5",
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable6",
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable7",
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable8"
];
//searchbar work function\

let cart = []

search.addEventListener("input", e => { //checks for input in the search bar input in the html file
    const value = e.target.value.toLowerCase(); //lowercase so everything can match with database and not show error
    console.log(value) //check for the words so i can see in console
    let in_search = []
    shop_list.forEach(item => {
        let itemElement = document.getElementById(item)
        const show = itemElement.id.toLowerCase().includes(value)
        if (show) {
            in_search.push(item)
        }
        itemElement.classList.toggle("hidden", !show) //check in css file
        console.log("Hidden" +show+ item)
    })
    updateResultCount(in_search)
})

const currentCountEl = document.getElementById('current-count')
const maxCountEl = document.getElementById('max-count')

function updateResultCount(list) {
  currentCountEl.textContent = list.length
  maxCountEl.textContent = shop_list.length
}

function addCart(id) {
    element = document.getElementById(id)
    cart.push(id)
}

function remove(id) {
    cart.remove(cart.indexOf(id))
}

