for (let i = 0; i < 5; i++) {
    console.log('hello');
}

// Number
let num = 42;

// String
let str = "JavaScript";

// Boolean
let bool = true;

// Undefined
let undef;

// Null
let nul = null;

// Symbol
let sym = Symbol('example');

// BigInt
let bigInt = 9007199254740991;

console.log(num, str, bool, undef, nul, sym, bigInt);

// String Fucntions
let exampleStr = "  Hello World!  ";
console.log("Length:", exampleStr.length); 
console.log("Trimmed:", exampleStr.trim());
console.log("Last Index:", exampleStr.lastIndexOf('p'));
console.log("Uppercase:", exampleStr.toUpperCase());
console.log("Lowercase:", exampleStr.toLowerCase());
console.log("Index:", exampleStr.indexOf('W'));

// Array Functions
// an indexed collection of homogeneous elements
// Stored in contiguous memory locations
let exampleArr = [1, 2, 3, 4, 5];
console.log("Array Length:", exampleArr.length);
console.log("First Element:", exampleArr[0]); 

const cars=["kia","bmw","audi","mercedes"];
cars.forEach((c) => {
    console.log(c);
});
var car=["kia","bmw","audi","mercedes"];
var bikes=new Array();
for (let i = 0; i < car.length; i++) {
    console.log(car[i]);}
    console.log(`The no.of cars are ${car.length}`);
    cars.forEach((c) => {
    console.log(c);
});
cars.map((c) => {
    console.log(c);
});
//pop,push,reverse,sort
var bikes=new Array();
bikes.push("honda");
bikes.push("yamaha");
bikes.push("suzuki");
bikes.push("hero");
console.log("The normal way:");
bikes.forEach((bike) => {
    console.log(bike);
});
bikes.sort();
console.log("The sorted way:");
bikes.map((bike) => {
    console.log(bike);
});
bikes.reverse();
console.log("The reversed way:");
bikes.map((bike) => {
    console.log(bike);
});
var demo={
              "name":"Virat",
              "age":35,
              "city":"Delhi"
              }
     console.log("Player name:"+ demo.name);
     console.log("Player age:"+ demo.age);
     console.log("Player city:"+ demo.city);
var books=[
    { 
        "book.id":101,
        "book_title":"C Programming",
        "book_author":"Dennis Ritchie",
    },
    { 
        "book.id":102,
        "book_title":"Java Programming",
        "book_author":"James Gosling",
    },
    { 
        "book.id":103,
        "book_title":"Python Programming",
        "book_author":"Guido van Rossum",
    }];
    for(var b of books){
        console.log("Book ID:"+ b["book.id"]);
        console.log("Book Title:"+ b["book_title"]);
        console.log("Book Author:"+ b["book_author"]);
    }