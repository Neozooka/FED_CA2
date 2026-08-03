let product_id = ""
//For the selection of actions

let NButton = document.getElementById("next")
let PButton = document.getElementById("previous")
let actionView = document.querySelector(".actionView")
let list = document.querySelector(".list")

//Calls the function with 1 parameter

function updateCarouselLayout(count) {
    let actions = document.querySelectorAll(".action")
    let carouselbutton = document.querySelectorAll(".carouselbutton")
    
    if (count === 1) {
        carouselbutton.forEach((button, index) => {
            button.classList.remove("bg-gray-700", "bg-gray-300")
            if (index === 0) {
                button.classList.add("bg-gray-700")
            } else if (index === 1) {
                button.classList.add("bg-gray-300")
            } else if (index === 2) {
                button.classList.add("bg-gray-300")
            }
        })
    } else if (count == 2) {
        carouselbutton.forEach((button, index) => {
            button.classList.remove("bg-gray-700", "bg-gray-300")
            if (index === 0) {
                button.classList.add("bg-gray-300")
            } else if (index === 1) {
                button.classList.add("bg-gray-700")
            } else if (index === 2) {
                button.classList.add("bg-gray-300")
            }
        })
    } else if (count == 3) {
        carouselbutton.forEach((button, index) => {
            button.classList.remove("bg-gray-700", "bg-gray-300")
            if (index === 0) {
                button.classList.add("bg-gray-300")
            } else if (index === 1) {
                button.classList.add("bg-gray-300")
            } else if (index === 2) {
                button.classList.add("bg-gray-700")
            }
        })
    }

    actions.forEach((card, index) => {
        card.classList.remove("z-10", "z-20","opacity-0","opacity-100")
        
        if (index === 0) {
            card.classList.add("opacity-0", "z-10")
        } else if (index === 1) {
            card.classList.add("opacity-100","z-20")
        } else if (index === 2) {
            card.classList.add("opacity-0", "z-10")
        }
    });
}

function next() {
    showSlider("next")
}
function previous() {
    showSlider("previous")
}

//Moves the card to the left/right

let count = 1

function showSlider(type) {
    let actions = document.querySelectorAll(".action")

    if (type === "next") {
        count += 1
        // console.log(count)
        setTimeout(() => {
            list.appendChild(actions[0])
            updateCarouselLayout(count)
        }, 20)
    } else {
        let lastPos = actions.length - 1
        count -= 1
        setTimeout(() => {
            list.prepend(actions[lastPos])
            updateCarouselLayout(count)
        }, 20)
        
    }

    if (count > 3) {
        count = 1
    } else if (count < 1) {
        count = 3
    } 
}

setInterval(next, 4000)

function returnId(id) {      
    product_id = id
}

function activeProduct(id) {
    // console.log("hi")
    elementRemoved = document.querySelectorAll(".Product-Button")
    elementRemoved.forEach(elem => {
        elem.classList.remove("border-gray-200", "border-red-500", "text-red-500")
        elem.classList.add("border-gray-200")
    })
    element = document.getElementById(id)
    element.classList.remove("border-gray-200")
    element.classList.add("border-red-500", "text-red-500")
    returnId(id)
    
}