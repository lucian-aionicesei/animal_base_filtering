"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let filteredAnimals = [];

// The prototype for all animals: 
const Animal = {
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0
};

function start() {
    // console.log("ready");

    let allButtons = document.querySelectorAll("button.filter");
    allButtons.forEach(element => {
        element.addEventListener("click", filter);
    });

    let allSortingButtons = document.querySelectorAll("[data-action=sort]");
    allSortingButtons.forEach(element => {
        element.addEventListener("click", sort);
    });

    loadJSON();
}

async function loadJSON() {
    const response = await fetch("animals.json");
    const jsonData = await response.json();

    // console.log(jsonData);
    // when loaded, prepare data objects
    prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
    allAnimals = jsonData.map(preapareObject);
    filteredAnimals = allAnimals;

    displayList(allAnimals);
}

function preapareObject(jsonObject) {
    const animal = Object.create(Animal);

    const texts = jsonObject.fullname.split(" ");
    animal.name = texts[0];
    animal.desc = texts[2];
    animal.type = texts[3];
    animal.age = jsonObject.age;

    return animal;
}


function displayList(animals) {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
    // create clone
    const clone = document.querySelector("template#animal").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}

function filter(buttonElm) {
    let filterBy;
    filterBy = buttonElm.target.getAttribute("data-filter");

    if (filterBy != "*") {
        filteredAnimals = allAnimals.filter(isAnimalType);
    } else {
        filteredAnimals = allAnimals;
    }

    function isAnimalType(animal) {
        if (animal.type === filterBy) {
            return true;
        } else {
            return false;
        }
    }

    displayList(filteredAnimals);
}

function sort(buttonElm) {
    let sortBy;
    let orderBy;
    let direction = 1;

    sortBy = buttonElm.target.getAttribute("data-sort");
    orderBy = buttonElm.target.getAttribute("data-sort-direction");

    if (orderBy === "asc") {
        buttonElm.target.dataset.sortDirection = "desc";
    } else {
        buttonElm.target.dataset.sortDirection = "asc";
    }

    if (orderBy === "asc") {
        direction = 1;
    } else {
        direction = -1;
    }

    console.log(sortBy);
    console.log(orderBy);

    filteredAnimals.sort(compareProperty);
    displayList(filteredAnimals);


    function compareProperty(a, b) {
        if (a[sortBy] < b[sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }
}