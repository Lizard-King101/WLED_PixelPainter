import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { MenuController } from 'src/app/_services/menu-controller';
import { SettingsService } from 'src/app/_services/settings.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    get banner(): string {
        return `assets/Logos & Banners/${this.settings.theme == 'light' ? 'banner_light.png' : 'banner_dark.png'}`
    }
    get logo(): string {
        return `assets/Logos & Banners/${this.settings.theme == 'dark' ? 'banner_white_small.png' : 'banner_black_small.png'}`
    }
    get icon(): IconProp {
        return ['fas', this.settings.theme == 'light' ? 'moon' : 'sun'];
    }
    get isLight(): boolean {
        return this.settings.theme == 'light';
    }

    get navClass() {
        return {
            'navbar-light': this.isLight,
            'bg-light': this.isLight,
            'navbar-dark': !this.isLight,
            'bg-dark': !this.isLight,
        }
    }

    constructor(
        public menuController: MenuController,
        private settings: SettingsService
        ) { }

    ngOnInit(): void {
    }


    onToggleTheme() {
        this.settings.theme = this.settings.theme == 'light' ? 'dark' : 'light';
    }

    scroll(id: string) {
        let el = document.getElementById(id)
        el?.scrollIntoView({behavior: 'smooth'});
    }
}
