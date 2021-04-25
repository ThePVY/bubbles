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
    let timerId, remainingTime = delay

    this.pause = function() {
        clearTimeout(timerId)
        remainingTime -= Date.now() - startTime
    }

    this.resume = function() {
        startTime = Date.now()
        clearTimeout(timerId)
        timerId = setTimeout(callback, remainingTime)
    }

    this.resume()
}