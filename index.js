window.onload = () => {
  const container = document.querySelector('#app-wrapper header')
  const needle = new Needle()
  needle.pointY = window.innerHeight - container.offsetHeight
  needle.node = document.querySelector('#app-wrapper header img')
  mouseWatcher.startWatch(container, (Xm = 0, Ym = 0, direction = 'left') => {
    needle.node.src = direction === 'right' ? './needle-to-right.png' : './needle-to-left.png'
    needle.node.style.left = `${Xm}px`
    needle.pointX = direction === 'right' ? Xm + 52 : Xm
  })

  const bubbleArea = document.querySelector('#app-wrapper')
  view.container = bubbleArea

  model.needle = needle

  controller.start()
}

/* (Xm, Ym,) => {
  const distance = Math.sqrt((bubble.x - Xm) ** 2 + (bubble.y - Ym) ** 2)
  if (distance < bubble.radius) {
    console.log("Puncture")
  }
} */

function Needle() {
  this.pointX = null
  this.pointY = null
  this.node = null
}

function Bubble(x, y, width, height) {
  this.x = x //abs coordinates of center
  this.y = y //abs coordinates of center
  this.width = width
  this.height = height
  this.radius = width / 2
  this.node = document.createElement('div')
  view.renderBubble(this)
}

const mouseWatcher = {
  x: 0,
  y: 0,
  watcher: null,
  prevX: this.x,
  direction: 'left',
  startWatch(container, handler = () => { }) {
    this.watcher = container.addEventListener('mousemove', function (e) {
      this.x = e.clientX
      this.y = e.clientY
      this.direction = this.x > this.prevX ? 'right' : 'left'
      handler(this.x, this.y, this.direction)
      this.prevX = this.x
    }.bind(this))

  },
  stopWatch(container) {
    container.removeEventListener('mousemove', this.watcher)
  }
}

const model = {
  width: 70,
  height: 70,
  needle: null,
  bubbles: [],
  createBubble() {
    const x = this.width * 2 + Math.random() * (window.innerWidth - this.width * 4)
    const y = this.height * 4
    this.bubbles.push(new Bubble(x, y, this.width, this.height))
  },
  removeBubbles() {
    this.bubbles.forEach(function(bubble) { bubble.node.remove() })
  },
  checkPuncture() {
    this.bubbles.forEach(function(bubble) {
      const distance = Math.sqrt((bubble.x - this.needle.pointX) ** 2 + (bubble.y - this.needle.pointY) ** 2)
      if (distance < bubble.radius) {
        console.log("Puncture")
        view.hide(bubble)
      }
    }.bind(this))
  }
}

const hoistController = {
  stepInterval: null,
  bubbles: model.bubbles,
  directionX: 1,
  stepX: 0,
  stepY: 4,
  startHoisting() {
    this.stepInterval = setInterval(function () {
      this.bubbles.forEach((bubble) => {
        bubble.x += this.stepX
        bubble.y += this.stepY
      })
      view.updateAll()
      model.checkPuncture()
    }.bind(this), 30)
  }
}

const view = {
  container: null,
  renderBubble(bubble) {
    this.update(bubble)
    this.container.appendChild(bubble.node)
  },
  updateAll() {
    model.bubbles.forEach((bubble) => this.update(bubble))
  },
  update(bubble) {
    bubble.node.classList.add('bubble')
    bubble.node.style.bottom = `${bubble.y - bubble.width / 2}px`
    bubble.node.style.left = `${bubble.x - bubble.width / 2}px`
    bubble.node.style.width = `${bubble.width}px`
    bubble.node.style.height = `${bubble.height}px`
    return bubble.node
  },
  hideAll() {
    model.bubbles.forEach((bubble => bubble.node.style.display = 'none'))
  },
  hide(bubble) {
    bubble.node.style.display = 'none'
  }
}

const controller = {
  creationInterval: null,
  start() {
    this.creationInterval = setInterval(function () {
      model.createBubble()
    }.bind(this), 1000)

    hoistController.startHoisting(model.bubbles)

    setTimeout(function () {
      this.stop()
    }.bind(this), 20000)
  },
  stop() {
    clearInterval(this.creationInterval)
    clearInterval(hoistController.stepInterval)
    model.removeBubbles()
    model.bubbles = null
    hoistController.bubbles = null
  }
}
