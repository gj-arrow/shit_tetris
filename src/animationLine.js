// Анимация взрыва при сборе линии
const createExplosionLine = (lineX, lineY) => {
  const colors = ['#FFD700', '#FF69B4', '#00FFFF', '#FF4500', '#32CD32', '#9370DB']
  const particles = Array.from({ length: 15 }, () => ({
    x: lineX + Math.random() * 20 - 10,
    y: lineY + Math.random() * 20 - 10,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 1,
    decay: 0.015 + Math.random() * 0.015
  }))
  const lines = Array.from({ length: 8 }, () => ({
    x1: lineX + Math.random() * 30 - 15,
    y1: lineY + Math.random() * 30 - 15,
    x2: lineX + Math.random() * 30 - 15,
    y2: lineY + Math.random() * 30 - 15,
    life: 1,
    decay: 0.01 + Math.random() * 0.01
  }))
  const stars = Array.from({ length: 5 }, () => ({
    x: lineX + Math.random() * 40 - 20,
    y: lineY + Math.random() * 40 - 20,
    radius: 1 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 1,
    decay: 0.008 + Math.random() * 0.008
  }))
  const confetti = Array.from({ length: 10 }, () => ({
    x: lineX + Math.random() * 20 - 10,
    y: lineY + Math.random() * 20 - 10,
    vx: (Math.random() - 0.5) * 3,
    vy: (Math.random() - 0.5) * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 1,
    decay: 0.02 + Math.random() * 0.02
  }))
  return { particles, lines, stars, confetti }
}

export default createExplosionLine