import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

const DefaultSettings: Settings = {
    theme: 'dark',
};

@Injectable()
export class SettingsService {

    set theme(theme: 'light' | 'dark') {
        this.settings.theme = theme;
        this.setTheme(theme);
        this.saveSettings();
    }
    get theme(): 'light' | 'dark' {
        return this.settings ? this.settings.theme : DefaultSettings.theme;
    }

    private settings: Settings;
    constructor(@Inject(DOCUMENT) private document: Document) {
        this.settings = DefaultSettings;
        const settings = JSON.parse(localStorage.getItem('settings')!);
        console.log(this.settings);
        if(settings != null) {
            this.theme = settings.theme;
        } else {
            this.theme = this.settings.theme;
        }
    }

    setTheme(theme: 'light' | 'dark') {
        if(theme === 'dark') {
            this.document.body.classList.add('dark');
        } else {
            this.document.body.classList.remove('dark');
        }
    }

    saveSettings() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }
}

interface Settings {
    theme: 'light' | 'dark';
}
