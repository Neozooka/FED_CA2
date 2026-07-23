path = "../../javascript/products.json"

let cart = JSON.parse(localStorage.getItem("userCart")) || []

function loadProductsFromList(cart) {
    const priceTotal = document.getElementById("checkout-total-price")
    const numberItems = document.getElementById("checkout-item-count")
    const CartTemplate = document.querySelector("[cart-template]")
    const CartContainer = document.querySelector("[cart-container]")
    let cost = 0
    
    CartContainer.innerHTML = ""
    let index = 0
    cart.forEach(item => {
        const card = CartTemplate.content.cloneNode(true)
        const title = card.querySelector("[title]")
        const price = card.querySelector("[price]")
        const photo = card.querySelector("[cart-image] img") 
        const remove = card.querySelector(".remove")
        const containerDiv = card.querySelector(".container")
        
        title.textContent = item.title
        price.textContent = "$" + item.price
        photo.src = item.image
        cost += item.price
        
        containerDiv.setAttribute("id", item.title)
        remove.setAttribute("id", index)
        
        CartContainer.appendChild(card)
        index += 1
    })

    numberItems.textContent = index
    priceTotal.textContent = cost + ".00"
    console.log(cost)
}

function saveCart() {
    localStorage.setItem("userCart", JSON.stringify(cart))
}

async function addCart(id) {
    const response = await fetch(path)
    
    const products = await response.json()
    
    const matchedProduct = products.find(item => {
        let productId = item.title
        console.log(`Comparing JSON Title: "${productId}" with Clicked ID: "${id}"`)
        return productId === id
    })
    console.log(matchedProduct)
    
    if (matchedProduct) {
        cart.push(matchedProduct)
        saveCart()
    }
    
    console.log(cart)
}

function remove(index) {
    const arrayIndex = parseInt(index)
    
    const cardContainer = index.closest(".container")
    if (cardContainer) {
        cardContainer.remove()
    }
    
    cart.splice(arrayIndex, 1)
        
    loadProductsFromList(cart)
}

const shop_list = [
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable",
    "nexus-single-monitor-arm-gas-spring-desk-mount-usb-ports",
    "nexus-usb-condenser-microphone-studio-quality-gain-control",
    "nexus-gaming-monitor-27-inch-4k-oled-240hz-ultra-fast",
    "nexus-lochness-gaming-headset-50mm-drivers-clearcast-microphone",
    "nexus-python-ultra-light-gaming-mouse-26k-dpi-59g-optical-switches",
    "nexus-kailh-box-jade-clicky-mechanical-switches",
    "nexus-clear-glass-gaming-mousepad-450x400mm-ultra-smooth",
    "nexus-gateron-baby-kangaroo-2-0-tactile-switches",
    "nexus-gateron-pro-3-0-yellow-linear-switches",
    "nexus-python-v2-gaming-mouse-30k-dpi-54g-optical-gen-3-switches"
]
//searchbar work function\

if (typeof search !== "undefined") {
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
}


window.addEventListener("DOMContentLoaded", () => {
    loadProductsFromList(cart)
})