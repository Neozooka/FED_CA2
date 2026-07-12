const foodlist = [
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable", 
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable2", 
    "nexus-60he-magnetic-keyboard-8000hz-polling-adjustable3"
];
//searchbar work function

search.addEventListener("input", e => { //checks for input in the search bar input in the html file
    const value = e.target.value.toLowerCase(); //lowercase so everything can match with database and not show error
    console.log(value) //check for the words so i can see in console
    foodlist.forEach(food => {
        let foodElement = document.getElementById(food)
        const show = foodElement.id.toLowerCase().includes(value);
        foodElement.classList.toggle("hidden", !show) //check in css file
        console.log("Hidden" +show+ food)
    })
})

