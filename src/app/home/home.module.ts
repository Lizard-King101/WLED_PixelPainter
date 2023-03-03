import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ColorModule } from "../_components/color/color.module";
import { HomeComponent } from "./home.component";

const Routes: Routes = [
    {
        path: '',
        component: HomeComponent
    }
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        RouterModule.forChild(Routes),
        ColorModule
    ],
    declarations: [
        HomeComponent
    ]
})
export class HomeComponentModule {}