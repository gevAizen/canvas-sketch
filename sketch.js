const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

let manager

// let text = 'gєv😎';
let text = 'A'
let fontSize = 1200
let fontFamily = 'serif'

const typeCanvas = document.createElement('canvas')
const typeContext = typeCanvas.getContext('2d')

const sketch = ({ context, width, height }) => {
  const cell = 20
  const cols = Math.floor(width / cell)
  const rows = Math.floor(height / cell)
  const numCells = cols * rows

  typeCanvas.width = cols
  typeCanvas.height = rows


  return ({ context, width, height }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols * 1.1

    typeContext.fillStyle = 'white';
    typeContext.font = `${fontSize}px ${fontFamily}`
    typeContext.textBaseline = 'top';
    
    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1
    const my = metrics.actualBoundingBoxAscent * -1
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
    const mh = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxDescent

    const cx = (cols - mw) * 0.5 - mx
    const cy = (rows - mh) * 0.5 - my

    typeContext.save();
    typeContext.translate(cx, cy);

    typeContext.beginPath()
    typeContext.rect(mx, my, mw, mh)
    typeContext.stroke()

    typeContext.fillText(text, 0, 0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data

    context.fillStyle = 'black'
    context.fillRect(0, 0, width, height)

    context.textBaseline = 'middle'
    context.textAlign = 'center'
    
    for (let i = 0; i < numCells; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)

      const x = col * cell
      const y = row * cell

      const r = typeData[i * 4 + 0]
      const g = typeData[i * 4 + 1]
      const b = typeData[i * 4 + 2]
      const a = typeData[i * 4 + 3]

      const glyph = getGlyph(r)

      context.font = `${cell * 2}px ${fontFamily}`
      if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`

      context.fillStyle = 'white'

      context.save()
      context.translate(x, y)
      context.translate(cell * 0.5, cell * 0.5)

      context.fillText(glyph, 0, 0)
      
      context.restore()
    }
  };
};

const getGlyph = (v) => {
  if (v < 50) return ''
  if (v < 100) return '-'
  if (v < 150) return '.'
  if (v < 100) return '+'

  const glyphs = '_= /'.split()

  return random.pick(glyphs)
}

const handleKeyUp = (e) => {
  text = e.key.toUpperCase()
  manager.render()
}

document.addEventListener('keyup', handleKeyUp)

const start = async() => {
  manager = await canvasSketch(sketch, settings);
}

start()