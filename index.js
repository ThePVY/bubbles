window.onload = () => {
  /* const buble = document.querySelector('.buble')
  console.log(buble.getBoundingClientRect()) */
  const container = document.querySelector('#app-wrapper')
  const bubble = new Bubble(400, 400, 200, 200)
  mouseWatcher.startWatch(container, (Xm, Ym,) => {
    const distance = Math.sqrt( (bubble.x - Xm)**2 + (bubble.y - Ym)**2 )
    if(distance < bubble.radius) {
      console.log("Puncture")
    }
  })
}

function Bubble(x, y, width, height) {
  this.x = x //abs coordinates of center
  this.y = y //abs coordinates of center
  this.width = width
  this.height = height
  this.radius = width / 2
  this.node = null
  this.render(this.create())
}

Bubble.prototype.create = function() {
  const bubble = document.createElement('div')
  this.node = bubble
  bubble.classList.add('bubble')
  this.setPosition(this.x, this.y)
  return bubble
}

Bubble.prototype.render = function(bubbleNode) {
  const container = document.getElementById('app-wrapper')
  container.appendChild(bubbleNode)
}

Bubble.prototype.setPosition = function(x, y) {
  this.node.style.width = `${this.width}px`
  this.node.style.height = `${this.height}px`
  this.node.style.top = `${y - this.width/2}px`
  this.node.style.left = `${x - this.width/2}px`
}

const mouseWatcher = {
  x: 0,
  y: 0,
  watcher: null,
  startWatch(container, handler = () => {}) {
    this.watcher = container.addEventListener('mousemove', function(e) {
      this.x = e.clientX
      this.y = e.clientY
      handler(this.x, this.y)
    }.bind(this))
    
  },
  stopWatch(container){
    container.removeEventListener('mousemove', this.watcher)
  }
}
