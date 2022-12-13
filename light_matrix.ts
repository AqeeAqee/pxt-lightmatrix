
/**
 * Auto Color Modes
 */
enum AutoColorModes {
    //% block="Auto Color Rainbow X"
    rainbowX = -1,
    //% block="Auto Color Rainbow Y"
    rainbowY = -2,
    //% block="Auto Color Rainbow XY"
    rainbowXY = -3,
    //% block="Auto Color Rainbow Center"
    rainbowCenter = -4,
}

/**
 * Layouts of PCB
 */
enum NeoPixelSLayoutFlipRows {
    //% block="Even"
    even = 0,
    //% block="Odd"
    odd = 1,
}

/**
 * Functions to operate NeoPixel strips.
 */
//% weight=5 color=#2699BF icon="\uf110"
namespace lightMatrix {
    /**
     * A matrix light strip
     */

    /**
     * Create a new matrix lights from a Neo light strip
     * @param strip the strip that matrix based on
     * @param width how many light a row in this matrix 
     */
    //% blockId="neopixel_create" block="Matrix of %strip=strip with %width lights in a row"
    //% weight=90 blockGap=8
    //% parts="neopixel"
    //% trackArgs=0,2
    //% blockSetVariable=strip
    export function create(strip: light.LightStrip, width:number){
        const matrix = new Matrix(strip, width)
        return matrix;
    }

    export class Matrix {
        strip:light.LightStrip

        _matrixWidth: number; // number of leds in a matrix - if any
        _sLayout: boolean
        _sLayoutFlipRows: NeoPixelSLayoutFlipRows;
        _matrixTransponed: boolean

        constructor(strip: light.LightStrip, width:number){
            this.strip=strip
            this._matrixWidth= width
        }

        /**
         * Set LED to a given color (range 0-255 for r, g, b).
         * You need to call ``show`` to make the changes visible.
         * @param pixeloffset position of the NeoPixel in the strip
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_set_pixel_color" block="%strip|set pixel color at %pixeloffset|to %rgb=neopixel_colors"
        //% strip.defl=strip
        //% blockGap=8
        //% weight=80
        //% parts="neopixel" advanced=true
        setPixelColor(pixeloffset: number, rgb: number): void {
            const index = pixeloffset + strip._start
            if (this._matrixWidth > 1 && this._sLayout && (Math.idiv(index, this._matrixWidth) % 2 == this._sLayoutFlipRows))
                pixeloffset = index + this._matrixWidth - 1 - 2 * (index % this._matrixWidth) - strip._start
            strip.setPixelColor(pixeloffset >> 0, rgb >> 0);
        }

        /**
         * Sets S layout in matrix shaped strip
         * @param layout layout modes, normal or in S order
         */
        //% blockId=neopixel_set_S_layout block="%strip|set S layout, flip rows %parity"
        //% strip.defl=strip
        //% blockGap=8
        //% weight=25
        //% parts="neopixel" advanced=true
        setSLayout(parity: NeoPixelSLayoutFlipRows) {
            this._sLayout = true
            this._sLayoutFlipRows = parity
        }

        /**
         * Sets the number of pixels in a matrix shaped strip
         * @param width number of pixels in a row
         */
        //% blockId=neopixel_set_matrix_width block="%strip|set matrix width %width"
        //% strip.defl=strip
        //% blockGap=8
        //% weight=31
        //% parts="neopixel" advanced=true
        setMatrixWidth(width: number) {
            this._matrixWidth = Math.min(strip._length, width >> 0);
        }

        /**
         * Sets matrix poseponed, x <--> y
         * @param width number of pixels in a row
         */
        //% blockId=neopixel_set_matrix_transponed_width block="%strip|set transponed matrix %transponed(true)"
        //% strip.defl=strip
        //% blockGap=8
        //% weight=24
        //% parts="neopixel" advanced=true
        setMatrixTransponed(transponed: boolean) {
            this._matrixTransponed = transponed
        }

        /**
         * Set LED to a given color (range 0-255 for r, g, b) in a matrix shaped strip
         * You need to call ``show`` to make the changes visible.
         * @param x horizontal position
         * @param y horizontal position
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_set_matrix_color" block="%strip|set matrix color at x %x|y %y|to %rgb=neopixel_colors"
        //% strip.defl=strip
        //% weight=29
        //% parts="neopixel" advanced=true
        setMatrixColor(x: number, y: number, rgb: number) {
            if (this._matrixWidth <= 0) return; // not a matrix, ignore
            x = x >> 0;
            y = y >> 0;
            rgb = rgb >> 0;

            if (rgb < 0) {
                rgb = this.getAutoColor(x, y, rgb)
            }

            if (this._matrixTransponed) { let v = x; x = y; y = v }

            const cols = Math.idiv(strip._length, this._matrixWidth);
            if (x < 0 || x >= this._matrixWidth || y < 0 || y >= cols) return;
            let i = x + y * this._matrixWidth;
            strip.setPixelColor(i, rgb);
        }

        getAutoColor(x: number, y: number, mode: AutoColorModes) {
            let hue
            const width = this._matrixTransponed ? strip.length() / this._matrixWidth : this._matrixWidth
            const height = this._matrixTransponed ? this._matrixWidth : strip.length() / this._matrixWidth
            switch (mode) {
                case AutoColorModes.rainbowX:
                    hue = (x + 1) * 360 / (width)
                    break;
                case AutoColorModes.rainbowY:
                    hue = (y + 1) * 360 / (height)
                    break;
                case AutoColorModes.rainbowXY:
                    hue = (x + y + 1) * 360 / (width + height)
                    break;
                case AutoColorModes.rainbowCenter:
                    hue = (Math.abs(x - width / 2) + Math.abs(y - height / 2)) * 360 / (width + height)
                    break;
            }
            if (this.autoColorLoopTime)
                hue += 360 - (control.millis() % this.autoColorLoopTime) * 360 / this.autoColorLoopTime
            return light.hsv(hue, 99, strip.brightness())
        }

        autoColorLoopTime: number

        /**
         * Set LED to a given color (range 0-255 for r, g, b) in a matrix shaped strip
         * You need to call ``show`` to make the changes visible.
         * @param x horizontal position
         * @param y horizontal position
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_set_auto_color_loop_time" block="%strip|set atuo color %loopTime"
        //% strip.defl=strip
        //% weight=19
        //% parts="neopixel" advanced=true
        setAutoColorLoopTime(loopTime: number = 5000) {
            this.autoColorLoopTime = loopTime
        }

        /**
         * Shows a image to a given color 
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_show_image" block="%strip|show image %image(myImage) at x %x|y %y|with %rgb=neopixel_colors"
        //% strip.defl=strip
        //% weight=22 blockGap=8 advanced=true inlineInputMode=inline
        //% parts="ledmatrix" async
        showImage(myImage: Image, offsetX: number, offsetY: number, color?: number) {
            for (let y = 0; y < myImage.height; y++) {
                for (let x = 0; x < myImage.width; x++) {
                    let c = myImage.getPixel(x, y)
                    if (c){
                        if(color)c=color
                        this.setMatrixColor(offsetX + x, offsetY + y, c)
                    }
                }
            }
            // this.show();
        }

        /**
         * get a image of a char from defualt font.
         * return the font of first letter if there's multi letter in parameter 'char'
         * or return empty image if char is empty
         * @param char string with one letter which font will be in returned image
         * @param rgb RGB color of the LED
         */
        //% blockId="neopixel_print_string" block="%strip|print %string at x %x|y %y|with %rgb=neopixel_colors"
        //% weight=21 blockGap=8 advanced=true inlineInputMode=inline
        //% parts="neopixel"
        printString(str: string, x: number, y: number, rgb: number) {
            for (let i = 0; i < str.length; i++) {
                // plotCharFont(str[i], (fx, fy) => {
                //     this.setMatrixColor(x + fx + i * neopixel.MICROBIT_FONT_WIDTH, y + fy, rgb)
                // })
            }
        }

        /**
         * Dim brightness to current colors, using half each time.
         * @param percent how % to dim brightness. eg: 10
         **/
        //% blockId="neopixel_each_brightness" block="%strip|dim brightness %percent |%" blockGap=8
        //% strip.defl=strip
        //% weight=57
        //% parts="neopixel" advanced=true
        dimBrightness(percent: number = 10): void {
            const stride = strip._mode === NeoPixelMode.RGBW ? 4 : 3;
            const br = strip.brightness();
            const buf = strip.buf;
            const end = strip._start + strip._length;
            const mid = Math.idiv(strip._length, 2);
            for (let i = strip._start; i < end; ++i) {
                const ledoffset = i * stride;
                const r = (buf[ledoffset + 0] * (100 - percent)) / 100; buf[ledoffset + 0] = r;
                const g = (buf[ledoffset + 1] * (100 - percent)) / 100; buf[ledoffset + 1] = g;
                const b = (buf[ledoffset + 2] * (100 - percent)) / 100; buf[ledoffset + 2] = b;
                if (stride == 4) {
                    const w = (buf[ledoffset + 3] * (100 - percent)) / 100; buf[ledoffset + 3] = w;
                }
            }
        }

    }

    /**
     * Gets the auto color modes
    */
    //% weight=20 blockGap=8
    //% blockId="neopixel_auto_color_modes" block="%mode"
    //% advanced=true
    export function getAutoColorModes(mode: AutoColorModes): number {
        return mode;
    }

}
