
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
 * Functions to operate NeoPixel Matrix.
 */
//% weight=95 color="#0078d7" icon="\uf00a"
//% groups='["Create", "Setup", "Display", "Color", "More"]'
namespace neoMatrix {
    /**
     * A matrix light strip
     */

    /**
     * Create a new NeoPixel matrix from a light strip
     * @param strip the strip that matrix based on
     * @param width how many light a row in this matrix, on the PCB
     */
    //% blockId="neomatrix_create" block="Matrix of %strip=variables_get(strip) with %width lights in a row"
    //% weight=95 blockGap=8
    //% group="Create"
    //% blockSetVariable=matrix
    export function create(strip: light.LightStrip, width:number){
        const matrix = new Matrix(strip, width)
        return matrix;
    }

    export class Matrix {
        myStrip:light.LightStrip

        _matrixWidth: number; // number of leds in a matrix - if any
        _sLayout: boolean
        _sLayoutFlipRows: NeoPixelSLayoutFlipRows;
        _matrixTransponed: boolean

        constructor(strip: light.LightStrip, width:number){
            this.myStrip=strip
            this._matrixWidth= width
        }

        /**
         * Sets the number of pixels in a row on the PCB of matrix shaped neo pixels. NOTE! not the width after transponed
         * @param width number of pixels in a row on the PCB. NOTE! not the width after transponed. eg:8
         */
        //% blockId=neopixel_set_matrix_width block="%matrix|set matrix width %width"
        //% matrix.defl=matrix
        //% weight=90 blockGap=8
        //% group="Setup"
        //% parts="neopixel"
        setMatrixWidth(width: number) {
            this._matrixWidth = Math.min(this.myStrip._length, width >> 0);
        }

        /**
         * Set LED to a given color (range 0-255 for r, g, b) in a matrix shaped strip
         * You need to call ``show`` to make the changes visible.
         * @param x horizontal position
         * @param y horizontal position
         * @param rgb RGB color of the LED
         */
        //% blockId="neomatrix_set_matrix_color" block="%matrix|set matrix color at x %x|y %y|to %rgb=neopixel_colors"
        //% matrix.defl=matrix
        //% weight=80
        //% group="Display"
        //% parts="neopixel"
        setMatrixColor(x: number, y: number, rgb: number) {
            if (this._matrixWidth <= 0) return; // not a matrix, ignore
            x = x >> 0;
            y = y >> 0;
            rgb = rgb >> 0;

            //auto color
            if (rgb < 0) {
                rgb = this.getAutoColor(x, y, rgb)
            }

            //transponed back to original x,y
            if (this._matrixTransponed) { let v = x; x = y; y = v }

            //constrain range to size
            const cols = Math.idiv(this.myStrip._length, this._matrixWidth);
            if (x < 0 || x >= this._matrixWidth || y < 0 || y >= cols) return;

            let index = x + y * this._matrixWidth

            //for S layout, flip even/odd rows
            if (this._matrixWidth > 1 && this._sLayout && (Math.idiv(index, this._matrixWidth) % 2 == this._sLayoutFlipRows)){
                index+= this.myStrip._start
                index = index + this._matrixWidth - 1 - 2 * (index % this._matrixWidth) - this.myStrip._start
            }
            
            this.myStrip.setPixelColor(index, rgb);
        }

        /**
         * Shows a image to a given color 
         * @param rgb RGB color of the LED
         */
        //% blockId="neomatrix_show_image" block="%matrix|show image %img=screen_image_picker at x %x|y %y|with %color=colorNumberPicker"
        //% weight=70 blockGap=8 inlineInputMode=inline
        //% group="Display"
        //% parts="ledmatrix" async
        showImage(img: Image, offsetX: number, offsetY: number) {
            const colors=palette.getCurrentColors()
            for (let y = 0; y < img.height; y++) {
                for (let x = 0; x < img.width; x++) {
                    const c = img.getPixel(x, y)
                    if (c){
                        let rgb=colors.color(c)
                        rgb= color.rgb(
                            color.unpackR(rgb) * this.rateR >>8,
                            color.unpackG(rgb) * this.rateG >>8,
                            color.unpackB(rgb) * this.rateB >>8
                        )
                        this.setMatrixColor(offsetX + x, offsetY + y, rgb)
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
        //% blockId="neomatrix_print_string" block="%matrix|print %string at x %x|y %y|with %rgb=neopixel_colors"
        //% matrix.defl=matrix
        //% weight=60 blockGap=8 inlineInputMode=inline
        //% group="Display"
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
        //% blockId="neomatrix_each_brightness" block="%matrix|dim brightness %percent |%" blockGap=8
        //% matrix.defl=matrix
        //% weight=50
        //% group="Color"
        //% parts="neopixel"
        dimBrightness(percent: number = 10): void {
            const stride = this.myStrip._mode === NeoPixelMode.RGBW ? 4 : 3;
            const br = this.myStrip.brightness();
            const buf = this.myStrip.buf;
            const end = this.myStrip._start + this.myStrip._length;
            const mid = Math.idiv(this.myStrip._length, 2);
            for (let i = this.myStrip._start; i < end; ++i) {
                const ledoffset = i * stride;
                const r = (buf[ledoffset + 0] * (100 - percent)) / 100; buf[ledoffset + 0] = r;
                const g = (buf[ledoffset + 1] * (100 - percent)) / 100; buf[ledoffset + 1] = g;
                const b = (buf[ledoffset + 2] * (100 - percent)) / 100; buf[ledoffset + 2] = b;
                if (stride == 4) {
                    const w = (buf[ledoffset + 3] * (100 - percent)) / 100; buf[ledoffset + 3] = w;
                }
            }
        }

        getAutoColor(x: number, y: number, mode: AutoColorModes) {
            let hue
            const width = this._matrixTransponed ? this.myStrip.length() / this._matrixWidth : this._matrixWidth
            const height = this._matrixTransponed ? this._matrixWidth : this.myStrip.length() / this._matrixWidth
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
            return light.hsv(hue, 99, this.myStrip.brightness())
        }

        autoColorLoopTime: number

        /**
         * Set LED to a given color (range 0-255 for r, g, b) in a matrix shaped strip
         * You need to call ``show`` to make the changes visible.
         * @param x horizontal position
         * @param y horizontal position
         * @param rgb RGB color of the LED
         */
        //% blockId="neomatrix_set_auto_color_loop_time" block="%matrix|set atuo color %loopTime"
        //% matrix.defl=matrix
        //% weight=45
        //% group="Color"
        //% parts="neopixel"
        setAutoColorLoopTime(loopTime: number = 5000) {
            this.autoColorLoopTime = loopTime
        }

    // advanced

        /**
         * Sets matrix poseponed, x <--> y
         * @param width number of pixels in a row
         */
        //% blockId=neopixel_set_matrix_transponed_width block="%matrix|set transponed matrix %transponed(true)"
        //% matrix.defl=matrix
        //% transponed.defl=true
        //% blockGap=8
        //% weight=60
        //% group="Setup"
        //% parts="neopixel" advanced=true
        setMatrixTransponed(transponed: boolean) {
            this._matrixTransponed = transponed
        }

        /**
         * Sets S layout in matrix shaped strip
         * @param layout layout modes, normal or in S order
         */
        //% blockId=neopixel_set_S_layout block="%matrix|set S layout, flip rows %parity"
        //% matrix.defl=matrix
        //% blockGap=8
        //% weight=50
        //% group="Setup"
        //% parts="neopixel" advanced=true
        setSLayout(parity: NeoPixelSLayoutFlipRows) {
            this._sLayout = true
            this._sLayoutFlipRows = parity
        }

        rateR = 255
        rateG = 255
        rateB = 255
        /**
         * tune rates of colors (range 0-255 for r, g, b)
         * @param rateR red rate 0~255. eg:255
         * @param rateG red rate 0~255. eg:255
         * @param rateB red rate 0~255. eg:255
         */
        //% blockId="neomatrix_set_color_rates" block="%matrix|set matrix color rates R %rateR|G %rateG|B %rateB"
        //% matrix.defl=matrix
        //% weight=40
        //% group="Color"
        //% parts="neopixel" advanced=true
        setColorRates(rateR: number, rateG: number, rateB: number) {
            this.rateR = rateR
            this.rateG = rateG
            this.rateB = rateB
        }

    }

    /**
     * Gets the auto color modes
    */
    //% weight=48 blockGap=8
    //% blockId="neomatrix_auto_color_modes" block="%mode"
    //% group="Color"
    export function getAutoColorModes(mode: AutoColorModes): number {
        return mode;
    }

}
