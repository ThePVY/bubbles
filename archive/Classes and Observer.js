/*----------------->Observer<---------------*/
const Subject = function() {
    const observers = new Set();

    this.a = 10;

    this.subscribe = function(observer) {
        observers.add(observer);
    };

    this.unsubscribe = function(observer) {
        observers.delete(observer);
    };

    this.publish = function() {
        observers.forEach(fn => {
            fn.call(this);
        });
    };
};


const subject = new Subject();

const obsr1 = () => console.log(`I'm observer 1 and a=${this.a}`);
const obsr2 = () => console.log(`I'm observer 2 and a=${this.a}`);
const obsr3 = function() {
    console.log(`I'm observer 2 and a=${this.a}`);
};

subject.subscribe(obsr1);
subject.subscribe(obsr2);
subject.subscribe(obsr3);

subject.publish();

/*-----------------------------------------------------------------------------*/
function Obj() {
    let _a; //private property

    //return object to implement get and set methods for private properties
    return {
        b: 'b', //public property
        get a() {
            console.log('Getter invoked by ' + this);
            return _a;
        },
        set a(val) {
            console.log('Setter invoked by ' + this);
            _a = val;
        }
    };
}

let obj1 = Obj();
let obj2 = Obj();

//получаем доступ к "приватному" свойству через сеттер
obj1.a = 1;
obj2.a = 2;

let a1 = obj1.a;
let a2 = obj2.a;

//создаем свойство с таким же именем, как и у "приватного"
obj1._a = 4;
obj2._a = 5;

//но set и get все равно обращаются к "приватному" свойству
a1 = obj1.a;
a2 = obj2.a;

/*-----------------------------------------------------------------------------*/
/*------- Наследуемся от Obj --------*/

function Foo() {
    //Obj.call(this);
    this.c = 'c';
}
Foo.prototype = new Obj();

let foo = new Foo();
//foo.b = 'bb';
console.log(foo.b);

let bar = new Foo();
bar.c = 'cc';
console.log(bar.a);

/*-----------------------------------------------------------------------------*/
/*-> Применим несколько иной подход к созданию класса с приватными свойствами -*/

function Class(name) {
    //private properties
    let _a = 'a';
    const _name = name;
    const iref = this;

    //public properties
    this.b = 'b';  

    //objects to implement get and set methods for private properties
    this.set = {
        set a(val) {
            console.log('Setter invoked by ' + _name);
            _a = val;
        }
    };
    this.get = {
        get a() {
            console.log('Getter invoked by ' + _name);
            return _a + iref.b; //example for getting access to public properties
        }
    };

    //instance method, but stored in memory for every instance
    this.iDisplay = function(message) {
        console.log(message + '!!!');
    }
}

//static method of Class
Class.display = function(message) {
    console.log(message + '!!!');
}

//instance method, but stored in memory only once
Class.prorotype.display = function(message) {
    console.log(message + '!!!');
}

debugger;

