window.onload = () => {
  const container = document.querySelector('#app-wrapper header')
  needle.pointX = window.innerWidth / 2
  needle.pointY = window.innerHeight - container.offsetHeight
  needle.node = document.querySelector('#app-wrapper header img')
  mouseWatcher.startWatch(container, (Xm = 0, Ym = 0, direction = 'left') => {
    needle.node.src = direction === 'right' ? './needle-to-right.png' : './needle-to-left.png'
    needle.node.style.left = `${Xm}px`
    needle.pointX = direction === 'right' ? Xm + 52 : Xm
  })

  view.bubbleAreaNode = document.querySelector('#app-wrapper')
  view.bubblesScoreNode = document.querySelector('#app-wrapper .bubbles')
  view.missesScoreNode = document.querySelector('#app-wrapper .misses')
  view.puncturesScoreNode = document.querySelector('#app-wrapper .punctures')

  model.needle = needle

  const startButton = document.querySelector('.restart-button-container button')
  controller.startButtonNode = startButton
  startButton.addEventListener('click', () => {
    controller.start()
    startButton.disabled = true
  })
}

/*-----------------------MODEL LAYER----------------------*/
const needle = {
  pointX: null,
  pointY: null,
  node: null
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
  needle: null,
  bubbles: [],
  createBubble() {
    const size = 50 + Math.random() * 200
    const x = size + Math.random() * (window.innerWidth - 2 * size)
    const y = size / 2 + window.innerHeight * 0.1
    this.bubbles.push(new Bubble(x, y, size))
    scoreController.bubbleCreated()
  },
  removeBubbleNodes() {
    this.bubbles.forEach(function (bubble) { this.removeBubbleNode(bubble) }.bind(this))
  },
  removeBubbleNode(bubble) {
    bubble.node.remove()
  },
  checkPuncture() {
    for (let i = 0; i < this.bubbles.length; i++) {
      const bubble = this.bubbles[i]
      const distance = Math.sqrt((bubble.x - this.needle.pointX) ** 2 + (bubble.y - this.needle.pointY) ** 2)
      if (distance < bubble.radius) {
        view.hide(bubble)
        scoreController.bubblePunctured()
        this.removeBubbleNode(bubble)
        this.removeBubble(bubble)
        return
      }
    }
  },
  checkMisses() {
    for (let i = 0; i < this.bubbles.length; i++) {
      const bubble = this.bubbles[i]
      if (bubble.y >= window.innerHeight + bubble.width) {
        scoreController.bubbleMissed()
        this.removeBubbleNode(bubble)
        this.removeBubble(bubble)
        return
      }
    }
  },
  removeBubble(bubble) {
    this.bubbles = this.bubbles.filter((b) => b !== bubble)
  },
  reset() {
    this.bubbles = []
  }
}
/*-----------------------VIEW LAYER----------------------*/
const view = {
  bubbleAreaNode: null,
  bubblesScoreNode: null,
  missesScoreNode: null,
  puncturesScoreNode: null,
  renderBubble(bubble) {
    this.update(bubble)
    bubble.node.style.backgroundColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
    this.bubbleAreaNode.appendChild(bubble.node)
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
  },
  displayBubblesScore() {
    this.bubblesScoreNode.innerHTML = `bubbles: ${scoreController.bubbles}`
  },
  displayMissesScore() {
    this.missesScoreNode.innerHTML = `misses: ${scoreController.misses}`
  },
  displayPuncturesScore() {
    this.puncturesScoreNode.innerHTML = `punctures: ${scoreController.punctures}`
  },
  displayScore() {
    this.displayBubblesScore()
    this.displayMissesScore()
    this.displayPuncturesScore()
  }
}
/*-----------------------CONTROL LAYER----------------------*/
const defaultStepY = 2

const hoistController = {
  hoistingOnGoing: true,
  stepInterval: null,
  stepY: defaultStepY,
  stepCount: 0,
  startHoisting() {
    this.hoistingOnGoing = true;
    this.stepCount = 0
    windController.start()
    this.stepInterval = setInterval(function () {
      model.bubbles.forEach((bubble) => {
        bubble.x += this.willBeInRange(bubble) ? this.getStep(bubble, windController.step) : 0
        bubble.y += this.stepY
      })
      view.updateAll()
      model.checkPuncture()
      model.checkMisses()
      this.countStep()
      this.speedUp()
      if (!model.bubbles.length && !scoreController.counting) {
        controller.onStopHoisting()
      }
    }.bind(this), 20)
  },
  willBeInRange(bubble) {
    const nextX = bubble.x + windController.step
    return nextX > bubble.radius && nextX < window.innerWidth - bubble.radius ? true : false
  },
  getStep(bubble, step) {
    return windController.direction === 1 ? 
      step * (window.innerWidth - bubble.radius - bubble.x) / (window.innerWidth - bubble.radius)
      :
      step * bubble.x / (window.innerWidth - bubble.radius)
  },
  countStep() {
    this.stepCount++
  },
  speedUp() {
    (this.stepCount % 500 === 0) && this.stepY++
  },
  reset() {
    clearInterval(this.stepInterval)
    this.hoistingOnGoing = false;
    this.stepCount = 0;
    this.stepX = defaultStepX
    this.stepY = defaultStepY
  }
}

const defaultDirection = 1
const defaultStepX = 5
const defaultWindTime = 5000

const windController = {
  direction: defaultDirection,
  step: defaultDirection * defaultStepX,
  windTime: defaultWindTime,
  start() {
    setTimeout(this.changeTheWind.bind(this), this.windTime)
  },
  changeTheWind() {
    this.direction = Math.round(Math.random()) ? 1 : -1
    //this.direction = defaultDirection
    this.step = this.direction * Math.round(Math.random() * defaultStepX)
    //this.step = this.direction * defaultStepX
    this.windTime = 500 + Math.round(Math.random() * (defaultWindTime - 500))
    hoistController.hoistingOnGoing && setTimeout(this.changeTheWind.bind(this), this.windTime)
  },
  reset() {
    this.direction = defaultDirection
    this.step = defaultStepX
    this.windTime = defaultWindTime
  }
}

const scoreController = {
  bubbles: 0,
  punctures: 0,
  misses: 0,
  counting: true,
  bubbleCreated() {
    this.bubbles++
    this.counting && view.displayBubblesScore()
    console.log(`bubbles: ${this.bubbles}`)
  },
  bubbleMissed() {
    this.misses++
    this.counting && view.displayMissesScore()
    console.log(`misses: ${this.misses}`)
  },
  bubblePunctured() {
    this.punctures++
    this.counting && view.displayPuncturesScore()
    console.log(`punctures: ${this.punctures}`)
  },
  reset() {
    this.bubbles = 0
    this.punctures = 0
    this.misses = 0
    this.counting = true
  }
}

const defaultCreationTime = 3000

const controller = {
  startButtonNode: null,
  creationOnGoing: true,
  creationTime: defaultCreationTime,
  start() {
    this.creationOnGoing = true
    view.displayScore()

    setTimeout(this.bubbleCreator.bind(this), this.creationTime)

    hoistController.startHoisting(model.bubbles)

    setTimeout(function () {
      this.stopCreation()
    }.bind(this), 60000)
  },
  stopCreation() {
    this.creationTime = defaultCreationTime
    this.creationOnGoing = false
    scoreController.counting = false
  },
  onStopHoisting() {
    model.removeBubbleNodes()
    model.reset()
    scoreController.reset()
    windController.reset()
    hoistController.reset()
    this.startButtonNode.disabled = false
  },
  bubbleCreator() {
    model.createBubble()
    if (this.creationTime >= 300) {
      this.creationTime *= 0.95
    }
    this.creationOnGoing && setTimeout(this.bubbleCreator.bind(this), this.creationTime)

  }
}


