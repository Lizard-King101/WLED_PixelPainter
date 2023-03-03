import { Component, HostBinding } from "@angular/core";
import { MenuController } from "src/app/_services/menu-controller";

@Component({
    selector: 'app-side-menu',
    templateUrl: 'side-menu.component.html',
    styleUrls: ['side-menu.component.scss']
})
export class SideMenuComponent {
    @HostBinding('class.open') get t() {
        return this.menuController.menuIsOpen;
    }


    constructor(
        public menuController: MenuController
    ) {

    }
}