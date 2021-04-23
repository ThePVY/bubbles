/*->Наследование приватных свойств - не наследуются!!!*/
function Foo(){
    let _a = 'a' // все наследники Foo будут изменять это одно свойство!!! через prototype chain

    this.set = {
        set a(val) {
            _a = val
        } 
    }
    this.get = {
        get a() {
            return _a
        }
    }

    this.getA = function() { 
        return _a 
    }
    this.setA = function(val) { 
        _a = val
     }
}

function Bar() {
    let _a = 'a'

    this.b = 'b'
}

Bar.prototype = new Foo()

let bar1 = new Bar()
let bar2 = new Bar()

bar1.set.a = 'a1'
bar2.set.a = 'a2'

bar1.get.a
bar2.get.a

bar1.setA('a1')
bar2.setA('a2')

let a1 = bar1.getA()
let a2 = bar2.getA()

debugger;