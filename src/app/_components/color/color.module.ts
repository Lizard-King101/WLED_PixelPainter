import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ColorComponent } from "./color.component";

@NgModule({
    declarations: [ColorComponent],
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [ColorComponent]
})
export class ColorModule {

}