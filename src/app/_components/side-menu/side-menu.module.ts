import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SideMenuComponent } from "./side-menu.component";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        RouterModule
    ],
    declarations: [
        SideMenuComponent
    ],
    exports: [
        SideMenuComponent
    ]
})
export class SideMenuComponentModule {}