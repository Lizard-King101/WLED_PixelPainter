import { AfterViewInit, Component, forwardRef, HostBinding, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Color, HSL, RGB } from "../../_objects/color.object";

@Component({
    selector: 'color',
    templateUrl: 'color.component.html',
    styleUrls: ['color.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ColorComponent),
            multi: true
        }
    ]
})
export class ColorComponent implements AfterViewInit, ControlValueAccessor {
    @Input('label') label?: string;
    editType: 'rgbs' | 'rgbp' | 'hsl' = 'hsl';

    color: Color;

    rgb: RGB;
    hsl: HSL;

    @HostBinding('style.--sat-track') get sat_track(): string {
        let c = new Color({h: this.hsl.h, s: 100, l: 50});
        return `linear-gradient( 90deg, rgba(80, 80, 80, 1) 0%,  rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, 1) 100%)`;
    }

    @HostBinding('style.--lit-track') get slit_track(): string {
        let c = new Color({h: this.hsl.h, s: this.hsl.s, l: 50});
        return `linear-gradient( 90deg, rgba(0, 0, 0, 1) 0%,  rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, 1) 50%, rgba(255, 255, 255, 1) 100%)`;
    }

    // get hue_thumb(): string {
    //     return new Color({h: this.hsl.h, s: 100, l: 50}).hex;
    // }

    constructor() {
        this.color = new Color();
        this.rgb = this.color.rgb;
        this.hsl = this.color.hsl;
        // this.color.hsl = {h: 50, s: .75, l: 1};
    }

    updateHEX() {
        this.rgb = this.color.rgb;
        this.hsl = this.color.hsl;
    }

    updateHSL() {
        this.color.hsl = this.hsl;
        this.rgb = this.color.rgb;
    }

    updateRGB() {
        this.color.rgb = this.rgb;
        this.hsl = this.color.hsl;
    }

    ngAfterViewInit() {

    }

    onChange(_value: Color) {};
    onTouch():void {}

    writeValue(_value: Color) {
        if(_value) {
            this.color = _value;
            this.rgb = this.color.rgb;
            this.hsl = this.color.hsl;
            console.log('Write Value', _value);
        } else {
            
            this.onChange(this.color);
        }
    }

    registerOnChange(fn: (_v: Color) => {}) {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => {}) {
        this.onTouch = fn;
    }
}