import { Injectable } from "@angular/core";
import Web3 from "web3";
import { BlockHeader } from "web3-eth";
import { TransactionReceipt } from 'web3-core';
import { Subscription } from 'web3-core-subscriptions';
// import { Web3ModalService } from "@mindsorg/web3modal-angular";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import detectEthereumProvider from '@metamask/detect-provider';
// import { ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
// const networks = {
//     1: 'Mainnet',
//     3: 'Ropsten'
// }

@Injectable()
export class ConnectService {
    private events: any = {};
    private _accounts: string[] = [];
    private _balance: any;

    public net_mismatch: boolean = false;
    public network_str: string = 'Mainnet';
    public network_id: number = 0;

    public web3?: Web3;
    public provider: any;

    private logSubscription?: Subscription<BlockHeader>;

    // public pendingTrx? : MatSnackBarRef<TextOnlySnackBar>
    public pendingData : any

    get balance(): string {
        return this._balance && this._balance != '' ? this.weitoeth(this._balance) : '0';
    }

    get accounts(): string[] {
        return this._accounts;
    }

    get connected(): boolean {
        return this._accounts.length > 0;
    }

    constructor(
        private router : Router,
        private http : HttpClient,
        // private web3modal: Web3ModalService,
    ){

        // if (localStorage.getItem('address')) this.connect()
    }

    async connect() {
        return new Promise((resolve, reject)=>{
            let ethereum = (window as any).ethereum;
            if (typeof ethereum !== 'undefined') {
                console.log('MetaMask is available');
            }
            if (ethereum) {
                try {
                    ethereum.request({ method: 'eth_requestAccounts' }).then(async (address:any) => {
                        this._accounts = address

                        localStorage.setItem('address', address[0])
                        resolve(address[0])

                        this.provider = await detectEthereumProvider();                    
                        this.web3 = new Web3(this.provider);

                        this._accounts = await this.web3.eth.getAccounts();
                        this._balance = await this.web3.eth.getBalance(this._accounts[0]);
                        this.subscribeLogs(this._accounts[0]);
                        this.emit('accountsChanged', this._accounts)

                        let net = await this.web3.eth.getChainId();
                        //console.log("get chain id", +net);
                        this.network_id = net;
                        // this.net_mismatch = !environment.ethereum_network.includes(+net);

                        this.provider.on('networkChanged', (id : any) => {
                            //console.log("network changed to", +id);
                            this.network_id = id;
                            this.net_mismatch = !environment.ethereum_network.includes(+id);
                            this.emit('networkChanged')
                        })

                        this.provider.on('accountsChanged', async (accounts : any) => {
                            console.log("accounts changed", accounts);
                            this._accounts = accounts;

                            if (accounts.length > 0){
                                this._balance = await this.web3!.eth.getBalance(this._accounts[0]);
                                this.subscribeLogs(this._accounts[0]);
                                this.emit('accountsChanged', this._accounts);
                            }
                            else {
                                localStorage.removeItem('address')
                            }
                        });

                        this.provider.on('chainChanged', () => {
                            this.web3!.eth.net.getId().then((id) => {
                                // console.log(id);
                            })
                        })

                        this.provider.on('disconnect', (code: number, reason: string) => {
                            // console.log(code, reason);
                        })

                        // this.provider.on('message', (message: any) => {
                        //     console.log("message", message);
                        // })
                    });
                } catch (error) {
                    // User denied account access...
                    console.log("User denied account access");
                    this.disconnect()
                }
            }
        })
    }

    subscribeLogs(address: string) {
        this.logSubscription = this.web3!.eth.subscribe('newBlockHeaders', (err, blockheader) => {
            // console.log('LOGS', data);
            // if(err) console.log(err);
        }).on('data', (blockHeader) => {
            // console.log(blockHeader);
            this.readBlock(blockHeader.number);
        })
    }

    async readBlock(currentBlock: number) {
        let transactions = await this.web3!.eth.getBlockTransactionCount(currentBlock);
        let currentTransaction = 0;
        while (currentTransaction <= transactions) {
            let tx = await this.web3!.eth.getTransactionFromBlock(currentBlock, currentTransaction);   
            // this.log('to - ', tx ? tx.to : 'null');  
            if (this._accounts.length > 0){
                if (tx && ((tx.to && tx.to.toLowerCase() == this._accounts[0].toLowerCase()) || (tx.from && tx.from.toLowerCase() == this._accounts[0].toLowerCase())) ) {
                    console.log("Transaction found", tx);
                    let error = false;
                    const complete = await this.isComplete(tx.hash).catch((err:any) => {
                        console.log(err);
                        error = true;
                    });
                    if(!complete) continue;
                    if(error) continue;
                    this._balance = await this.web3!.eth.getBalance(this._accounts[0]);
                    // console.log('USER:', this.web3!.utils.hexToAscii(tx.input));

                    if (tx.from.toLowerCase() == this._accounts[0].toLowerCase()){
                        this.emit('transaction-success', tx)
                        // TRANSACTION COMPLETE
                        
                        this.showToast({ header: "Metamask Trx Success", message: `Trx Hash: ${tx.hash.slice(0,6)}...${tx.hash.slice(-4)}`, external: `https://etherscan.io/tx/${tx.hash}`, duration: 6000, color: 'success' })
                        // if (this.pendingData) this.http.post(API + "/storeEthAddress", { username: this.pendingData[0], address: this.pendingData[1] }).subscribe(async (res : any) => {})
                        this.pendingData = undefined
                    }
                }
            }
            currentTransaction++;
        }
    }

    async isComplete(txHash: string): Promise<boolean> {
        return new Promise((res, rej) => {
            this.web3!.eth.getTransactionReceipt(txHash, (error: Error, receipt: TransactionReceipt) => {
                if(error) rej(error);
                else res(receipt.status);
            });
        })
    }

    async disconnect() {
        this._accounts = [];
        localStorage.removeItem('address');
    }

    async editAccounts(){
        await (window as any).ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }]
        }).then((res : any)=>{
            console.log(res);
            this.connect()
        });
    }

    getAccounts(){
        // console.log(this.web3?.eth.accounts);
        
        return new Promise(async (resolve, reject) => {
            let provider : any = await detectEthereumProvider();                    
            let web3 = new Web3(provider);
            let accounts = await web3.eth.getAccounts();
            console.log(accounts);
            resolve(accounts)
        })
    }

    on(event: "accountsChanged"): Subject<Array<string>>;
    on(event: string): Subject<any> {
        const sub = new Subject();
        if (this.events[event] && this.events[event].length) {
            this.events[event].push(sub);
        } else { this.events[event] = [sub]; }
        return sub;
    }

    private emit(event: string, data?: any) {
        if (this.events[event]) {
            for (const ev of this.events[event]) {
                ev.next(data);
            }
        }
    }

    private weitoeth(weival: string | number): string {
        let wei: string = '0';
        if(typeof weival == 'number') wei = weival + '';
        else wei = weival;

        return this.web3 ? this.web3.utils.fromWei(wei, 'ether') : '0';
    }

    async showToast(data: {
        header: string;
        message?: string;
        icon?: string;
        link?: string;
        linkText?: string;
        duration?: number;
        color?: string;
        close? : boolean;
        external? : string;
    }) {
        let buttons : any[] = []
        if (data.icon) buttons.push({ side: 'start', icon: data.icon })
        if (data.link) buttons.push({ side: 'end', text: data.linkText ? data.linkText : 'VIEW', handler: () => { this.router.navigateByUrl(data.link!) } })
        if (data.close) buttons.push({ side: 'end', icon: 'close-sharp', role: 'cancel' })
        
        if (data.external) buttons.push({ side: 'end', text: data.linkText ? data.linkText : 'VIEW', handler: async () => { 
            let url : any = data.external
            // if ((window as any).Capacitor.isPluginAvailable('Browser')) await Browser.open({ toolbarColor: '#131725', url })
            // else 
            window.open(url, '_blank')
        }})

        let msg = data.message ? `${data.header} : ${data.message}` : `${data.header}`

        // this.pendingTrx = this.snack.open(msg, 'Ok', {
        //     duration: data.duration ? data.duration : 4000,
            
        // })
    

        // this.pendingTrx = await this.toast.create({
        //     header: data.header,
        //     message: data.message,
        //     duration: data.duration ? data.duration : undefined,
        //     position: 'bottom',
        //     color: data.color ? data.color : 'dark',
        //     cssClass: 'left-toast',
        //     buttons
        // });
        // this.pendingTrx.present();

        // return this.pendingTrx;
    }


}

export interface MetamaskError {
    code : number
    message : string
    stack : string
}