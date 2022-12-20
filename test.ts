
let bg = image.create(160, 120)
scene.setBackgroundImage(bg)

let strip2: light.NeoPixelStrip = null
let colorRate: number[] = [255, 255, 255]
let indexC: number = 0

strip2 = light.createStrip(pins.pinByCfg(416), 192) //416=CFG_PIN_P16
strip2.setMode(NeoPixelMode.RGB)
strip2.setBrightness(255)
strip2.setBuffered(true)

let matrix = neoMatrix.create(strip2, 16)
matrix.setSLayout(NeoPixelSLayoutFlipRows.odd)
matrix.setMatrixTransponed(true)
matrix.setColorRates(colorRate[0], colorRate[1], colorRate[2])

let chirsmasTree=img`
    f f f f f f 5 f f f f f f f f f
    f f f f f 5 5 5 f f f f f f f f
    f f f f f f 7 f f f f f f f f f
    f f f f f 7 7 7 f f f f f f f f
    f f f f 7 7 7 7 2 f f f f f f f
    f f f 7 7 7 7 5 7 7 f f f f f f
    f f f f f 7 9 7 f f f f f f f f
    f f f f 7 3 7 7 7 f f f f f f f
    f f f 7 4 7 7 7 7 7 f f f f f f
    f f 7 7 7 7 7 7 7 2 7 f f f f f
    f f f f 7 7 7 7 5 7 f f f f f f
    f f 7 7 9 7 7 9 7 7 7 7 f f f f
    f 7 7 7 7 4 3 7 7 7 7 7 7 f f f
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 f f
    f f f f f f e e f f f f f f f f
    f f f 2 2 f e e f f 3 3 f f f f
`
let aniHeroShield = [
    sprites.castle.heroWalkShieldSideRight1, 
    sprites.castle.heroWalkShieldSideRight2, 
    sprites.castle.heroWalkShieldSideRight3, 
    sprites.castle.heroWalkShieldSideRight4
]
let aniDuck = [
    sprites.duck.duck1,
    sprites.duck.duck2,
    sprites.duck.duck3,
    sprites.duck.duck4,
    sprites.duck.duck5,
    sprites.duck.duck6,
]
let aniMonkey = [
    sprites.builtin.forestMonkey0,
    sprites.builtin.forestMonkey1,
    sprites.builtin.forestMonkey2,
    sprites.builtin.forestMonkey3,
    sprites.builtin.forestMonkey4,
    sprites.builtin.forestMonkey5,
    sprites.builtin.forestMonkey6,
    sprites.builtin.forestMonkey7,
    sprites.builtin.forestMonkey8,
    sprites.builtin.forestMonkey9,
    sprites.builtin.forestMonkey10,
]
let testImg = img`
    . . . . . . f f f f . . . . . .
    . . . . f f f 2 2 f f f . . . .
    . . . f f f 2 2 2 2 f f f . . .
    . . f f f e e e e e e f f f . .
    . . f f e 2 2 2 2 2 2 e e f . .
    . . f e 2 f f f f f f 2 e f . .
    . . f f f f e e e e f f f f . .
    . f f e f b f 4 4 f b f e f f .
    . f e e 4 1 f d d f 1 4 e e f .
    . . f e e d d d d d d e e f . .
    . . . f e e 4 4 4 4 e e f . . .
    . . e 4 f 2 2 2 2 2 2 f 4 e . .
    . . 4 d f 2 2 2 2 2 2 f d 4 . .
    . . 4 4 f 4 4 5 5 4 4 f 4 4 . .
    . . . . . f f f f f f . . . . .
    . . . . . f f . . f f . . . . .
`
let paletteImg = img`
    . 1 2 3 4 5 6 7 8 9 a b c d e f
    . 1 2 3 4 5 6 7 8 9 a b c d e f
    . 1 2 3 4 5 6 7 8 9 a b c d e f
    . 1 2 3 4 5 6 7 8 9 a b c d e f
    . 1 2 3 4 5 6 7 8 9 a b c d e f
    . 1 2 3 4 5 6 7 8 9 a b c d e f
    . 1 2 3 4 5 6 7 8 9 a b c d e f
    . 1 2 3 4 5 6 7 8 9 a b c d e f
`
let imgMi=img`
    . . . . . . . . . . . . . . . .
    . . . . . . . 2 . . . . . . . .
    . . . . . . . 2 . . . . 7 . . .
    . . 5 5 . . . 2 . . 7 7 7 . . .
    . . . . 5 5 . 2 . 7 7 . . . . .
    . . . . . 5 5 2 . 7 . . . . . .
    . . . . . . . 2 . . . . . . . .
    . 3 3 3 3 3 3 2 3 3 3 3 3 3 3 .
    . . . . . . . 2 . . . . . . . .
    . . . . . 8 . 2 . . . . . . . .
    . . . . 8 8 . 2 . 4 4 . . . . .
    . . . 8 8 . . 2 . . 4 4 . . . .
    . . 8 8 . . . 2 . . . 4 4 . . .
    . 8 8 . . . . 2 . . . . 4 4 . .
    8 8 . . . . . 2 . . . . . 4 4 4
    . . . . . . . 2 . . . . . . . 4
`
let imgStrawberry=img`
    . . . . . . . . . . . . . . 7 7
    . . . . . . . 7 7 7 7 7 . . 7 .
    . . . . . 2 2 2 2 2 7 7 7 7 7 .
    . . . . 2 2 2 2 2 2 2 2 7 7 7 7
    . . . 2 2 2 2 2 2 2 2 2 2 2 7 7
    . . 2 2 2 2 f 2 2 2 2 2 2 2 2 7
    . . 2 2 2 2 2 2 2 2 2 2 2 2 2 7
    . 2 2 2 2 2 2 2 2 f 2 2 f 2 2 2
    . 2 2 2 2 2 2 f 2 2 2 2 2 2 2 2
    2 2 2 2 f 2 2 2 2 2 2 2 2 2 2 2
    2 2 2 2 2 2 2 2 2 2 2 2 2 f 2 .
    2 f 2 2 2 2 2 f 2 2 2 2 2 2 2 .
    2 2 2 2 2 2 2 2 2 2 2 2 2 2 . .
    2 2 2 2 2 2 2 2 2 2 2 2 2 . . .
    2 2 2 2 f 2 2 2 2 2 2 . . . . .
    2 2 2 2 2 2 2 2 . . . . . . . .
`
let imgBuildin=img`
    . . . . . . b b b b a a . . . .
    . . . . b b d d d 3 3 3 a a . .
    . . . b d d d 3 3 3 3 3 3 a a .
    . . b d d 3 3 3 3 3 3 3 3 3 a .
    . b 3 d 3 3 3 3 3 b 3 3 3 3 a b
    . b 3 3 3 3 3 a a 3 3 3 3 3 a b
    b 3 3 3 3 3 a a 3 3 3 3 d a 4 b
    b 3 3 3 3 b a 3 3 3 3 3 d a 4 b
    b 3 3 3 3 3 3 3 3 3 3 d a 4 4 e
    a 3 3 3 3 3 3 3 3 3 d a 4 4 4 e
    a 3 3 3 3 3 3 3 d d a 4 4 4 e .
    a a 3 3 3 d d d a a 4 4 4 e e .
    . e a a a a a a 4 4 4 4 e e . .
    . . e e b b 4 4 4 4 b e e . . .
    . . . e e e e e e e e . . . . .
    . . . . . . . . . . . . . . . .
`
let anis = [[imgBuildin], aniHeroShield,aniDuck,aniMonkey,[chirsmasTree,chirsmasTree,chirsmasTree,],[imgMi, imgMi, imgMi, imgMi]]

let showSprite = sprites.create(testImg, SpriteKind.Player)
showSprite.setScale(6, ScaleAnchor.Left)


let px = 0, dirx = 1
let py = 0, diry = 1
let iFrame=0,iAni = 0, dirAni = 1
game.onUpdateInterval(150, function () {
    if (++iFrame >= anis[iAni].length) {
        iAni++; iFrame=0
        if(iAni>=anis.length)
            iAni=0
    }
    py += diry
    if (py < 0 || py > 8) diry *= -1
    px += dirx
    if (px < -10 || px > 0) dirx *= -1

    strip2.setAll(0x010001)
    const frame = anis[iAni][iFrame]
    matrix.showImage(frame, 0, 0)
    showSprite.setImage(frame)
    // matrix.print("test",px,py,0x00ff00)
    strip2.show()
})

//color rates
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (--indexC < 0)
        indexC = 2
    setNeoPixel()
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (++indexC > 2)
        indexC = 0
    setNeoPixel()
})
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    colorRate[indexC] += 1
    setNeoPixel()
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    colorRate[indexC] += -1
    setNeoPixel()
})
controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
    colorRate[indexC] += 1
    setNeoPixel()
})
controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
    colorRate[indexC] += -1
    setNeoPixel()
})

let colors = palette.getCurrentColors()
function setNeoPixel() {
    bg.fill(0)
    bg.print(colorRate.join(), 0, 0, 1)
    bg.print("^", indexC * 22 + 10, 12, 2)
    matrix.setColorRates(colorRate[0], colorRate[1], colorRate[2])
}
