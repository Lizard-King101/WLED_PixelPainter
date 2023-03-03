import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SettingsService } from './_services/settings.service';
import { ConnectService } from './_services/connect.service';

import { HeaderComponentModule } from './_components/header/header.module';
import { SideMenuComponentModule } from './_components/side-menu/side-menu.module';

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuController } from './_services/menu-controller';

// import { Web3ModalModule, Web3ModalService, Web3ModalComponent } from '@mindsorg/web3modal-angular';
// import { IProviderControllerOptions, IProviderOptions } from '@mindsorg/web3modal-angular/lib/web3modal-ts/src';
// import WalletLink from "walletlink";
// import WalletConnectProvider from '@walletconnect/web3-provider';

import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { HttpClientModule } from '@angular/common/http';
import { AppToastService } from './_services/toast.service';

// const providerOptions: IProviderOptions = {
//   injected: {
//     display: {
//       logo: "assets/metamask.svg",
//       name: "Metamask",
//       description: "Connect with the provider in your Browser"
//     },
//     package: null
//   },
//   walletlink: {
//     package: WalletLink,
//     options: {
//       infuraUrl: 'https://mainnet.infura.io/v3/19e7be8536f84defad83ca89cdef4fc8',
//       appName: "My Awesome DApp",
//       appLogoUrl: "assets/coinbase.svg",
//       darkMode: false
//     },
//   },
//   walletconnect: {
//     display: {
//       logo: "assets/walletconnect-circle.svg",
//       name: "Wallet Connect",
//       description: "Scan qrcode with your mobile wallet"
//     },
//     package: WalletConnectProvider,
//     options: {
//       infuraId: "19e7be8536f84defad83ca89cdef4fc8" // required
//     }
//   }
// };

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderComponentModule,
    SideMenuComponentModule,
    HttpClientModule,
    NgbModule,
    FontAwesomeModule,
    // Web3ModalModule
  ],
  providers: [
    SettingsService,
    MenuController,
    ConnectService,
    AppToastService
    // {
    //   provide: Web3ModalService,
    //   useFactory: () => {
    //     return new Web3ModalService({
    //       network: "mainnet",
    //       cacheProvider: false,
    //       providerOptions
    //     } as IProviderControllerOptions);
    //   },
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
}
