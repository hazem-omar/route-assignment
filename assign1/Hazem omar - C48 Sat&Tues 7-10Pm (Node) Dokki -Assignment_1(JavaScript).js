// part 1
// question 1
let x = "123";
console.log(Number(x) + 7); // 130
// =================================================== //
// question 2
let y = 0;
if (!y) {
  console.log("invalid");
} else {
  console.log("truthy");
}
// =================================================== //
// question 3
for (let i = 1; i <= 10; i++) {
  if (i % 2 == 0) {
    continue;
  }
  console.log(i);
}
// =================================================== //
// question 4

const arr = [1, 2, 3, 4, 5];
let evenNumbers = arr.filter((ele) => ele % 2 == 0); // [2,4]
console.log(evenNumbers);

// =================================================== //
// question 5
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let arr3 = [...arr1, ...arr2];
console.log(arr3);
// =================================================== //
// question 6

let day = 2;
switch (day) {
  case 1:
    console.log("Sunday");
    break;
  case 2:
    console.log("Monday");
    break;
  case 3:
    console.log("Tuesday");
    break;
  case 4:
    console.log("Wednesday");
    break;
  case 5:
    console.log("Thursday");
    break;
  case 6:
    console.log("Friday");
    break;
  case 7:
    console.log("Saturday");
    break;
  default:
    console.log("Invalid day");
}
// =================================================== //
// question 7

let arrString = ["a", "ab", "abc"];
let m = arrString.map((ele) => {
  return ele.length;
});
console.log(m);
// =================================================== //
// question 8
let CheckNumber = (num) => {
  if (num % 3 == 0 && num % 5 == 0) {
    console.log("Divisible by both");
  } else {
    console.log("Not Divisible by both");
  }
};
CheckNumber(15); // Divisible by both
CheckNumber(10); // Not Divisible by both
// =================================================== //
// question 9
let squareNum = (num) => {
  return num * num;
};
console.log(squareNum(5)); // 25
// =================================================== //
// question 10
const person = {
  name: "John",
  age: 25,
};

let destructObj = (obj) => {
  let { name, age } = obj;
  return `${name} is ${age} years old.`;
};
console.log(destructObj(person));

// =================================================== //
// question 11
let summ = (...numbers) => {
  let total = 0;
  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
  }
  console.log(total);
};
summ(1, 2, 3, 4, 5); // 15

// =================================================== //
// question 12

let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("success");
  }, 3000);
  resolve();
});
// =================================================== //
// question 13
let n = [1, 2, 3, 4, 5, 7, 8];
let largeNum = (arr) => {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
};
console.log(largeNum(n)); // 8
// =================================================== //
// question 14
let obj1 = {
  name: "john",
  age: 30,
};
let takeobj = (obj) => {
  let arr = [];
  for (let key in obj) {
    arr.push(key);
  }
  return arr;
};
console.log(takeobj(obj1)); // ["name", "age"]
// =================================================== //
// question 15

let text = "The quick brown fox";
let getWords = (str) => {
  let words = str.split(" ");
  return words;
};
console.log(getWords(text)); // ["The", "quick", "brown", "fox"]
// ============================================================================//

// part 2 essay questions
// q1
/* for of and foreach are both used to iterate the elemnts in the array.
the difference between them is for of can be used with any iterable object like arrays, strings, maps ,etc , while foreach can only be used with arrays.
the for of allows you to use break and continue to control the loop ,but for each can not use them 
*/

// q2
/*
  hoisting-> is js behaviour that variable and declaration are moved to top of their scope before code is executed
    TDZ->period in js where let and cost variable can not access  their scope before initialization and cause reference error 
    console.log(x) 
    let x =5; -> TDZ

    example of hoisting 
    console.log(m);
    var m=4;

*/

// q3
/*
  == (loose equality ) -> compare values only and perorm type coerision  before comparing 
  ===(strict equlity ) -> compare value and data Type and do not perform type coercion
*/

//q4
/*
     try catch are used to handle the error without crash the program
    we put the code that may cause an error in try block and if the code cause an error then we execute the catch code to handle the error

    so we need them because if we wanna to fetch an api and make a request to server and the request may fail so try-catch allows us to handle this error without crashing the program
 */

//q5
/*


 type convertion -> we use  to convertfrom  one type to another using built in function 
 example
 Number()
 String()
 Object()
 Boolen()


 type coercion --> the js convert it automitically when needed
 
 exapmle
 * string + number 

 console.log("10"+5) // 105
 
 * bool + number 
 console.log(true + 5);
 */