function moving () {
    if (x + dirX > 32 - 5 * 5 || x + dirX < 0) {
        dirX = dirX * -1
    }
    if (y + dirY > 4 || y + dirY < 0) {
        dirY = dirY * -1
    }
    x += dirX
    y += dirY
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function() {
    counting = !(counting)
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function() {
    control.reset()
})
let S = ""
let M = ""
let H = ""
let timeSpan = 0
let hue = 0
let x = 0
let counting = false
let dirY = 0
let dirX = 0
let y = 0
y = 2
dirX = 0
dirY = 0
// basic.showIcon(IconNames.Heart)
let strip = light.createNeoPixelStrip(pins.LED, 256, NeoPixelMode.RGB)
let range = neoMatrix.create(strip, 8)
range.setSLayout(NeoPixelSLayoutFlipRows.odd)
// range.setBrightness(44)
range.setMatrixTransponed(true)
counting = true
range.setAutoColorLoopTime(-3333)
// basic.pause(100)
basic.forever(function () {
    moving()
    hue = (hue + 0) % 360
    if (counting) {
        // timeSpan+=.1
        timeSpan = control.millis() / 1000 + 36660
        H = convertToText(Math.floor(timeSpan / 3600))
        M = convertToText(Math.floor(timeSpan / 60 % 60))
        S = convertToText(Math.floor(timeSpan % 60))
        if (H.length < 2) {
            H = "0" + H
        }
        if (M.length < 2) {
            M = "0" + M
        }
        if (S.length < 2) {
            S = "0" + S
        }
        // (m1+m2+":"+s1+s2)
        strip.clear()
        range.printString(H, 0, y, neoMatrix.getAutoColorModes(AutoColorModes.rainbowXY))
        range.printString(M, 11, y, neoMatrix.getAutoColorModes(AutoColorModes.rainbowY))
        range.printString(S, 22, y, neoMatrix.getAutoColorModes(AutoColorModes.rainbowX))
        if (control.millis() % 1000 < 500) {
            range.printString(":", 9, y, 3)
            range.printString(":", 20, y, 3)
        }
        strip.show()
    }
})
