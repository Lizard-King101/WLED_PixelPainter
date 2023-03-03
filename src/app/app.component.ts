import { Component } from '@angular/core';
import { MenuController } from './_services/menu-controller';
import { SettingsService } from './_services/settings.service';
import { AppToastService } from './_services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'isodopes';

  get logo(): string {
    return `assets/Logos & Banners/${this.settings.theme == 'dark' ? 'banner_white_small.png' : 'banner_black_small.png'}`
  }

  get icon(): string {
    return `assets/Logos & Banners/${this.settings.theme == 'dark' ? 'Isodopes Logo Small White.png' : 'Isodopes Logo Small Black.png'}`
  }

  constructor(
    public menuController: MenuController,
    public toastService: AppToastService,
    private settings: SettingsService,
    ) {}

  onCloseMenu() {
    if(this.menuController.menuIsOpen) this.menuController.toggleMenu()
  }
}