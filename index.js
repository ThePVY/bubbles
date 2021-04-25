const startInformation = stringToNode(`
<div class='centered-container'>
  <span class="information">
    <p>Click "Start", grab Needle above and Puncture all those annoying bubbles!</p>
    <br>
    <p>Though be careful, bubbles hoisting speed will increase with time and
    wind will blow up bubbles, so be ready!</p>
  </span>
</div>
`)

const pauseInformation = stringToNode(`
<div class='centered-container'>
  <span class="information">
    <p>Paused</p>
  </span>
</div>
`)

window.onload = () => {
  const headerNode = document.querySelector('#app-wrapper header')
  needle.pointX = window.innerWidth / 2
  needle.pointY = window.innerHeight - headerNode.offsetHeight
  needle.node = document.querySelector('#app-wrapper header img')

  view.bubbleAreaNode = document.querySelector('#app-wrapper')
  view.bubblesScoreNode = document.querySelector('#app-wrapper .bubbles')
  view.missesScoreNode = document.querySelector('#app-wrapper .misses')
  view.puncturesScoreNode = document.querySelector('#app-wrapper .punctures')

  model.needle = needle


  const informationPanel = document.querySelector('.information-panel')
  informationPanel.appendChild(startInformation)
  controller.informationPanelNode = informationPanel

  const startButton = document.querySelector('.controls .restart-button')
  controller.startButtonNode = startButton
  startButton.addEventListener('click', () => {
    controller.start()
    startButton.disabled = true
    pauseButton.disabled = false
    stopButton.disabled = false
    informationPanel.style.display = 'none'
  })

  const pauseHandler = (ctrlFn, nextPBValue, info, disp) => {
    ctrlFn()
    pauseButton.innerHTML = nextPBValue
    informationPanel.innerHTML = ''
    informationPanel.appendChild(info)
    view.setDisplay(informationPanel, disp)
    //view.nullifySize(informationPanel)
  }

  const pauseButton = document.querySelector('.controls .pause-button')
  controller.pauseButtonNode = pauseButton
  pauseButton.addEventListener('click', () => {
    if (pauseButton.innerHTML === 'Pause') {
      pauseHandler(controller.pause.bind(controller), 'Resume', pauseInformation, 'block')
    }
    else if (pauseButton.innerHTML === 'Resume') {
      pauseHandler(controller.resume.bind(controller), 'Pause', startInformation, 'none')
    }
  })

  const stopButton = document.querySelector('.controls .stop-button')
  controller.stopButtonNode = stopButton
  stopButton.addEventListener('click', () => {
    pauseHandler(controller.resume.bind(controller), 'Pause', startInformation, 'none')
    controller.stop()
  })

  mouseWatcher.startWatch(needle.node, view.bubbleAreaNode, (Xm = 0, Ym = 0, direction = 'left') => {
    needle.node.src = direction === 'right' ? './needle-to-right.png' : './needle-to-left.png'
    needle.node.style.left = `${Xm}px`
    needle.pointX = direction === 'right' ? Xm + 52 : Xm
  })
}

/*-----------------------MODEL LAYER----------------------*/
const needle = {
  pointX: null,
  pointY: null,
  node: null
}

const mouseWatcher = {
  x: 0,
  y: 0,
  needleNode: null,
  appNode: null,
  controlNeedle: null,
  prevX: this.x,
  direction: 'left',
  startWatch(needleNode, appNode, controlNeedle = () => { }) {
    this.needleNode = needleNode
    this.appNode = appNode
    this.controlNeedle = controlNeedle
    this.bindListeners()
    this.needleNode.style.cursor = 'grab'
    console.log('start watching')
    this.needleNode.addEventListener('mousedown', this.needleListener)

  },
  needleListener(e) {
    console.log('mouse down on needle')
    this.needleNode.style.cursor = 'grabbing'
    this.appNode.style.cursor = 'grabbing'
    this.appNode.addEventListener('mousemove', this.mouseMoveListener)
    this.appNode.addEventListener('mouseup', this.removeListeners)
  },
  mouseMoveListener(e) {
    this.x = e.clientX
    this.y = e.clientY
    this.direction = this.x > this.prevX ? 'right' : 'left'
    this.controlNeedle(this.x, this.y, this.direction)
    this.prevX = this.x
  },
  removeListeners(e) {
    console.log('listeners removed')
    this.needleNode.style.cursor = 'grab'
    this.appNode.style.cursor = 'default'
    this.appNode.removeEventListener('mousemove', this.mouseMoveListener)
    this.appNode.removeEventListener('mouseup', this.removeListeners)
  },
  bindListeners() {
    this.needleListener = this.needleListener.bind(this)
    this.mouseMoveListener = this.mouseMoveListener.bind(this)
    this.removeListeners = this.removeListeners.bind(this)
  }
}

const model = {
  needle: null,
  bubbles: [],
  createBubble() {
    const size = 100 + Math.random() * 150
    const x = size + Math.random() * (window.innerWidth - 2 * size)
    const y = size / 2 + window.innerHeight * 0.1
    this.bubbles.push(new Bubble(x, y, size))
    scoreController.bubbleCreated()
  },
  checkPuncture() {
    for (let i = 0; i < this.bubbles.length; i++) {
      const bubble = this.bubbles[i]
      const distance = Math.sqrt((bubble.x - this.needle.pointX) ** 2 + (bubble.y - this.needle.pointY) ** 2)
      if (distance < bubble.radius) {
        view.hide(bubble)
        scoreController.bubblePunctured()
        view.removeBubbleNode(bubble)
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
        view.removeBubbleNode(bubble)
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
  removeBubbleNodes(bubbles) {
    bubbles.forEach(function (bubble) { this.removeBubbleNode(bubble) }.bind(this))
  },
  removeBubbleNode(bubble) {
    bubble.node.remove()
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
  },
  setDisabled(node, disabled) {
    node.disabled = disabled
  },
  setDisplay(node, value) {
    node.style.display = value
  },
  nullifySize(node) {
    node.style.height = '0px'
    node.style.width = '0px'
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
    this.stepInterval = new Interval(function () {
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
    this.stepInterval.clear()
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
  windTimer: null,
  start() {
    this.windTimer = new Timer(this.changeTheWind.bind(this), this.windTime)
  },
  changeTheWind() {
    this.direction = Math.round(Math.random()) ? 1 : -1
    //this.direction = defaultDirection
    this.step = this.direction * Math.round(Math.random() * defaultStepX)
    //this.step = this.direction * defaultStepX
    this.windTime = 500 + Math.round(Math.random() * (defaultWindTime - 500))
    if (hoistController.hoistingOnGoing) {
      this.windTimer = new Timer(this.changeTheWind.bind(this), this.windTime)
    }
  },
  reset() {
    this.windTimer.clear()
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
  pauseButtonNode: null,
  stopButtonNode: null,
  informationPanelNode: null,
  creationOnGoing: true,
  creationTime: defaultCreationTime,
  gameTimer: null,
  creationTimer: null,
  start() {
    this.creationOnGoing = true
    view.displayScore()

    this.creationTimer = new Timer(this.bubbleCreator.bind(this), this.creationTime)

    hoistController.startHoisting(model.bubbles)

    this.gameTimer = new Timer(function () {
      this.stopCreation()
    }.bind(this), 60000)
  },
  stopCreation() {
    this.creationTimer.clear()
    this.gameTimer.clear()
    this.creationTime = defaultCreationTime
    this.creationOnGoing = false
  },
  onStopHoisting() {
    view.removeBubbleNodes(model.bubbles)
    model.reset()
    windController.reset()
    hoistController.reset()
    view.displayScore()
    scoreController.reset()
    view.setDisabled(this.startButtonNode, false)
    view.setDisabled(this.pauseButtonNode, true)
    view.setDisabled(this.stopButtonNode, true)
    view.setDisplay(this.informationPanelNode, 'block')
  },
  bubbleCreator() {
    model.createBubble()
    if (this.creationTime >= 300) {
      this.creationTime *= 0.95
    }
    this.creationTimer = this.creationOnGoing && new Timer(this.bubbleCreator.bind(this), this.creationTime)
  },
  pause() {
    this.gameTimer.pause()
    this.creationTimer.pause()
    windController.windTimer.pause()
    hoistController.stepInterval.pause()
  },
  resume() {
    this.gameTimer.resume()
    this.creationTimer.resume()
    windController.windTimer.resume()
    hoistController.stepInterval.resume()
  },
  stop() {
    this.stopCreation()
    this.onStopHoisting()
  }
}


