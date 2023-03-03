import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Color } from '../_objects/color.object';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;
  ctx?: CanvasRenderingContext2D;
  pixelSize: number = 20;
  matrixSize = {
    width: 21,
    height: 16
  };
  colorSwaps: [Color, Color] = [
    new Color('#5544cc'),
    new Color('#000000')
  ];

  get activeColor(): Color {
    return this.colorSwaps[0];
  }
  set activeColor(val: Color) {
    this.colorSwaps[0] = val;
  }

  lastMousePos?: Pos;
  mousePos?: Pos;

  pixels: Color[] = [];

  mouseDown = false;

  constructor() {
    for(let i = 0; i < this.matrixSize.width * this.matrixSize.height; i++) {
      this.pixels.push(new Color('#000000'));
    }
    this.pixels[10].rgb = {
      r: 100,
      g: 100,
      b: 255
    }
    console.log(this.pixels);
    
  }

  ngAfterViewInit(): void {
    console.log(this.canvas);
    if(!this.canvas) return;
    let canvas = this.canvas.nativeElement;
    this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    this.resizeCanvas();
    this.updateCanvas();
  }

  resizeCanvas() {
    if(!this.canvas) return;
    let canvas = this.canvas.nativeElement;
    canvas.width = this.matrixSize.width * this.pixelSize;
    canvas.height = this.matrixSize.height * this.pixelSize;
  }

  updateCanvas() {
    if(!this.ctx) return;
    for(let x = 0; x < this.matrixSize.width; x++) {
      for(let y = 0; y < this.matrixSize.height; y++) {
        let i = x + this.matrixSize.width * y;
        let color = this.pixels[i];
        this.ctx.fillStyle = color.hex;
        this.ctx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
      }
    }
  }

  onMouseDown(ev: MouseEvent) {
    let pos = this.getPos(ev);
    this.mousePos = pos;
    this.mouseDown = true;
  }

  onMouseUp(ev: MouseEvent) {
    let pos = this.getPos(ev);
    this.mousePos = undefined;
    this.lastMousePos = undefined;
    this.mouseDown = false;
  }

  onMouseMove(ev: MouseEvent) {
    if(!this.mouseDown) return;
    let pos = this.getPos(ev);
    this.mousePos = pos;
    if(this.lastMousePos) {
      let cords = this.getPixelsBetween(this.mousePos, this.lastMousePos);
      for(let cord of cords) {
        let { x, y } = cord;
        let i = x + this.matrixSize.width * y;
        let color = this.pixels[i];

        color.hex = this.activeColor.hex;
      }
    } else {

      let { x, y } = pos;
      let i = x + this.matrixSize.width * y;
      let color = this.pixels[i];

      color.hex = this.activeColor.hex;
    }
    
    
    this.updateCanvas();
    this.lastMousePos = pos;
  }

  onClick(ev: any) {
    console.log(ev);
    let { x, y } = this.getPos(ev);
    let i = x + this.matrixSize.width * y;
      let color = this.pixels[i];

      color.hex = this.activeColor.hex;
      this.updateCanvas();
  }

  getPixelsBetween(A: Pos, B: Pos) {
    function slope(a: Pos, b: Pos) {
        if (a.x == b.x) {
            return null;
        }
    
        return (b.y - a.y) / (b.x - a.x);
    }
    
    function intercept(point: Pos, slope: number | null) {
        if (slope === null) {
            // vertical line
            return point.x;
        }
    
        return point.y - slope * point.x;
    }
    
    var m = slope(A, B);
    var b = intercept(A, m);
    
    var coordinates: Pos[] = [];
    for (var x = A.x; x <= B.x; x++) {
        var y = m! * x + b;
        coordinates.push({x, y});
    }
    return coordinates;
  }

  getPos(ev: MouseEvent) {
    let x = (<any>ev).layerX;
    let y = (<any>ev).layerY;
    let target = <HTMLElement>ev.target;
    let pixelSize = target.clientWidth / this.matrixSize.width;
    return {
      x: Math.floor(x / pixelSize),
      y: Math.floor(y / pixelSize)
    } as Pos;
  }

  onSwapColors() {
    this.colorSwaps.reverse()
  }

}

interface Pos {
  x: number;
  y: number;
}