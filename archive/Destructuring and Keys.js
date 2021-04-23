"use strict"

window.onload = function(){
	let button = document.getElementById("clickme");
	let message = document.getElementById("message");
	let clickCounter = 0;
	button.onclick = function(){
		clickCounter++;
		message.innerHTML = "You clicked me " + clickCounter + " times!";
	};

	console.log("abc".reverse());
	console.log("abc".isPalindrome());

};


String.prototype.reverse = function(){
	let reversed = "";
	for(let char of this){
		reversed = char + reversed;
	}
	return reversed;
};

String.prototype.isPalindrome = function(){
	return this == this.reverse();
};






const m = {
	H: [0],
	e: [1],
	l: [2, 3, 9],
	o: [4, 7],
	' ': [5],
	w: [6],
	r: [8],
	d: [10]
};


const buildString = obj => {
	return Object.keys(obj)
		.reduce((acc, key) => {
			obj[key].forEach(position => acc[position] = key);
			return acc;
		}, [])
		.join('');
};

console.log(buildString(m));

function A(){
	this.name = "a";

	A.prototype.instances++;

	console.log(this);
}
A.prototype.instances = 0;

const a1 = new A();
const a2 = new A();
const a3 = new A();
console.log(A.prototype.instances);






// Используется фича - destructuring
function Func({
	a = 1,
	b = 1
} = {}) {
	this.a = a;
	this.b = b;	
	this.c = function(){
		return a + b;
	};
}

let f = new Func({a: 2});


console.log("a: " + f.a);
console.log("b: " + f.b);
console.log("c: " + f.c());


