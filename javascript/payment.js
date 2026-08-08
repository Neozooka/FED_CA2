const cardNumber = document.getElementById("cardNumber")
const expiry = document.getElementById("expiry")
const cvv = document.getElementById("CVV")
const cardName = document.getElementById("cardName")

function showAlert(inputElement, alertElement, msg, isValid) {
    if (isValid) {
        inputElement.classList.remove("border-red-500", "focus:border-red-500")
        inputElement.classList.add("border-gray-700", "focus:border-gray-500")
        alertElement.classList.add("hidden")
        alertElement.innerText = ""
    } else {
        inputElement.classList.remove("border-gray-700", "focus:border-gray-500")
        inputElement.classList.add("border-red-500", "focus:border-red-500")
        alertElement.classList.remove("hidden")
        alertElement.innerText = msg
    }
}

let cardNumberList = []
let ExpiryList = []
let CVVList = []
let NameList = []

let isValid1 = false
let isValid2 = false
let isValid3 = false
let isValid4 = false

cardNumber.addEventListener("input", e => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 16) value = value.slice(0, 16)
    e.target.value = value

    const isValid = value.length === 16
    if (isValid) {
        isValid1 = true
    } else {
        isValid1 = false
    }
    const msg = "Card number must be exactly 16 digits."
    cardNumberList.push(value)
    showAlert(cardNumber, document.getElementById("cardNumber-alert"), msg, isValid || value.length === 0)
    checkFormValidity()
})

expiry.addEventListener("input", e => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2, 4)
    e.target.value = value

    const expiryCheck = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/
    const isValid = expiryCheck.test(value)
    if (isValid) {
        isValid2 = true
    } else {
        isValid2 = false
    }
    const msg = "Expiry date must be a valid date in MM/YY format."
    ExpiryList.push(value)
    showAlert(expiry, document.getElementById("expiry-alert"), msg, isValid || value.length === 0)
    checkFormValidity()
});

cvv.addEventListener("input", e => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 3) value = value.slice(0, 3)
    e.target.value = value

    const isValid = value.length === 3
    if (isValid) {
        isValid3 = true
    } else {
        isValid3 = false
    }
    const msg = "CVV must be exactly 3 digits."
    CVVList.push(value)
    showAlert(cvv, document.getElementById("CVV-alert"), msg, isValid || value.length === 0)
    checkFormValidity()
})

cardName.addEventListener("input", e => {
    let value = e.target.value.trim()
    const nameCheck = /^[a-zA-Z\s]+$/
    const isValid = (nameCheck.test(value) && value.length) > 1
    if (isValid) {
        isValid4 = true
    } else {
        isValid4 = false
    }
    const msg = "name must contain only letters and be at least 2 characters long."
    NameList.push(value)
    showAlert(cardName, document.getElementById("cardName-alert"), msg, isValid || e.target.value.length === 0)
    checkFormValidity()
})

const payButton = document.getElementById("payButton")

function checkFormValidity() {
    if (isValid1 && isValid2 && isValid3 && isValid4) {
        payButton.disabled = false
        payButton.classList.remove("opacity-50", "cursor-not-allowed")
    } else {
        payButton.disabled = true
        payButton.classList.add("opacity-50", "cursor-not-allowed")
    }
}

checkFormValidity()

function print() {
    // console.log(cart)
    alert(`Credit Card Number: ${cardNumberList.pop()} Expiry: ${ExpiryList.pop()} CVV: ${CVVList.pop()} Name: ${NameList.pop()}`)
}

function choosePayment(id) {
    element = document.querySelectorAll(".pay-button")
    exactButton = document.getElementById(id)

    element.forEach(button => {
        button.classList.remove("border-red-500", "font-medium", "text-red-500", "border-gray-700", "text-gray-500")
        button.classList.add("border-gray-700", "text-gray-500")
    })

    exactButton.classList.remove( "border-gray-700", "text-gray-500")
    exactButton.classList.add("border-red-500", "text-red-500", "font-medium")
    

}

const qrImages = {
    paynow: "../images/payment-qr/PayNowFakeQr.png",
    paylah: "../images/payment-qr/PayLahFakeQr.png"
}

function showQR(type) {
    const modal = document.getElementById("qrModal")
    const titleContainer = document.getElementById("qrTitle")
    const img = document.getElementById("qrImage")

    titleContainer.innerHTML = ""

    const title = document.createElement("h3")
    title.className = "text-xl sm:text-2xl font-medium text-white mb-6"

    if (type === "paylah") {
        title.textContent = "DBS PayLah!"
        img.src = qrImages.paylah
    } else {
        title.textContent = "PayNow"
        img.src = qrImages.paynow
    }

    titleContainer.appendChild(title)

    modal.classList.remove("hidden")
}

function closeQR() {
    document.getElementById("qrModal").classList.add("hidden")
}

function closeOnOutsideClick(event) {
    if (event.target.id === "qrModal") {
        closeQR()
    }
}