function stringToNode(string) {
    const template = document.createElement('template')
    template.innerHTML = string.trim()
    return template.content.firstChild
}

function Bubble(x, y, size) {
    this.x = x //abs coordinates of center
    this.y = y //abs coordinates of center
    this.width = size
    this.height = size
    this.radius = size / 2
    this.node = document.createElement('div')
    view.renderBubble(this)
}

function Timer(callback, delay) {
    let timerId, startTime, remainingTime = delay

    this.clear = function() {
        clearTimeout(timerId)
    }

    this.pause = function () {
        clearTimeout(timerId)
        remainingTime -= Date.now() - startTime
    }

    this.resume = function () {
        startTime = Date.now()
        clearTimeout(timerId)
        timerId = setTimeout(callback, remainingTime)
    }

    this.resume()
}

function Interval(callback, delay) {
    let intervalId, startTime, remainingTime = delay

    this.clear = function () {
        clearInterval(intervalId)
        clearTimeout(intervalId)
    }

    this.pause = function () {
        this.clear()
        remainingTime -= Date.now() - startTime
    }

    this.resume = function () {
        this.clear()
        startTime = Date.now()
        intervalId = setTimeout(() => {
            callback()
            startTime = Date.now()
            intervalId = setInterval(() => {
                callback()
                startTime = Date.now()
            }, delay)
        }, remainingTime)
    }

    this.resume()
}