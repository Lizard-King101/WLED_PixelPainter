export class Color {
    _hex: string = '#ff0000';
    _rgb: RGB = {r: 255, g: 0, b: 0};
    _hsl: HSL = {h: 0, s: 1, l: .5};


    get hex(): string {
        return this._hex;
    }
    set hex(hex: string) {
        this._hex = hex;
        this._rgb = this.hexToRgb(this._hex);
        this._hsl = this.rgbToHsl(this._rgb);
    }

    get rgb(): RGB {
        return this._rgb;
    }
    set rgb(rgb: RGB) {
        this._rgb = rgb;
        this._hex = this.rgbToHex(this._rgb);
        this._hsl = this.rgbToHsl(this.rgb);
    }


    get hsl(): HSL {
        return this._hsl;
    }
    set hsl(hsl: HSL) {
        this._hsl = hsl;
        this._rgb = this.hslToRgb(this._hsl);
        this._hex = this.rgbToHex(this._rgb);
    }


    constructor(color?: RGB)
    constructor(color?: HSL)
    constructor(color?: string)
    constructor(color?: string | HSL | RGB) {
        if(color) {
            if(typeof color == 'string' && this.isColor(color)) {
                this.rgb = this.hexToRgb(color);
            } else if((<HSL>color).h != undefined && (<HSL>color).s != undefined && (<HSL>color).l != undefined ) {
                this.hsl = <HSL>color;
            } else if((<RGB>color).r != undefined && (<RGB>color).g != undefined && (<RGB>color).b != undefined) {
                this.rgb = <RGB>color;
            } else {
                this.rgb = {r: 255, g: 0, b: 0};
            }
        } else {
            this.rgb = {r: 255, g: 0, b: 0};
        }
    }

    isColor(color: any): boolean {
        if(color.r && color.g && color.b) return true;
        if(color.h && color.s && color.l) return true;
        if(typeof color == 'string' && color.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/g)) return true;
        return false;
    }

    hslToRgb(hsl: HSL): RGB {
        let { h, s, l } = hsl;
        h /= 360; s /= 100; l /= 100;
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p: any, q: any, t: any) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;

            r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
            g = Math.round(hue2rgb(p, q, h) * 255);
            b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
        }
        return {
            r, 
            g, 
            b
        };
    }

    rgbToHsl(rgb: RGB): HSL {
        let { r, g, b } = rgb;
        r /= 255;
        g /= 255;
        b /= 255;
      
        let cmin = Math.min(r,g,b),
            cmax = Math.max(r,g,b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        if (delta == 0) h = 0;
        else if (cmax == r)  h = ((g - b) / delta) % 6;
        else if (cmax == g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
      
        h = Math.round(h * 60);
      
        if (h < 0) h += 360;
      
        l = (cmax + cmin) / 2;
      
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      
        s = Math.round(s * 100);
        l = Math.round(l * 100);
      
        return {
            h,
            s,
            l
        }
    }
    
    hexToRgb(hex: string): RGB {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if(result) {
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            }
        } else {
            return {r: 255, g: 0, b: 0};
        }
    }

    rgbToHex(rgb: RGB): string {
        let { r, g, b } = rgb;
        let componentToHex = (c: number) => {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
}

export interface RGB {
    /** 0-255 */
    r: number;
    /** 0-255 */
    g: number;
    /** 0-255 */
    b: number;
}

/**
 * HSL
 * 
 * @Property h - number: 0-360
 * @Property s - number: 1-100
 * @Property l - number: 0-100
 */
export interface HSL {
    /** 0-360 */
    h: number;
    /** 1-100 */
    s: number;
    /** 0-100 */
    l: number;
}