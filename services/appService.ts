import { Injectable } from '@angular/core';
import { MiscellaneousService } from './miscellaneous.service';
import { ConfigurationService } from 'bdt105angularconfigurationservice';
import { ToastController, LoadingController, Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toolbox } from 'bdt105toolbox/dist';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class Keys {
    configurationKey: string;
    translateKey: string;
    connexionKey: string;
}

export class AppService {

    protected keys: Keys;

//    public itemsPlusStorageKey = 'itemsPlus';
    private versionFileUrl = "./assets/version.json";
    protected applicationName: string;

    toolbox: Toolbox = new Toolbox();

    constructor(protected http: HttpClient, protected configurationService: ConfigurationService, protected toastController: ToastController, protected platform: Platform,
        protected miscellaneousService: MiscellaneousService, protected barcodeScanner: BarcodeScanner, protected loadingCtrl: LoadingController) {
    }

    setVariable(keys: any, applicationName: string, miscellaneousService: MiscellaneousService) {
        this.keys = keys;
        miscellaneousService.configurationKey = this.keys.configurationKey;
        miscellaneousService.translateKey = this.keys.translateKey;
        miscellaneousService.connexionKey = this.keys.connexionKey;
        let lang = this.getCurrentLaguage();
        this.applicationName = applicationName;
        miscellaneousService.currentLanguage = lang ? lang : null;
    }
    
    loadConfiguration() {
        this.configurationService.load(this.keys.configurationKey, "./assets/configuration.json", false);
    }

    loadTranslation() {
        this.configurationService.load(this.keys.translateKey, "./assets/translation.json", false);
    }

    getApplicationName(){
        return this.applicationName;
    }

    getUser() {
        let user = this.miscellaneousService.getCurrentUser();
        return user;
    }

    setLanguage(language: string) {
        let conn = this.toolbox.readFromStorage(this.keys.connexionKey, true);
        if (conn) {
            conn.language = language;
        }
        this.toolbox.writeToStorage(this.keys.connexionKey, conn, true);
    }

    getCurrentLaguage() {
        let lang = this.toolbox.readFromStorage(this.keys.connexionKey, true);
        return lang ? lang.language : null;
    }

    getToken() {
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHVzZXIiOjUsImxvZ2luIjoidGVzdCIsInBhc3N3b3JkIjoiJDJhJDEwJFZuL3pQQ004c1NTYVluUm1nZ1Y0Q09lTHJsdmxsNVZaSU5saEYza0M2am4zVFdYQ0ZuVm9XIiwiZW1haWwiOiJ0ZXNAZ21haWwuY29tIiwidHlwZSI6MCwiY291bnRyeSI6bnVsbCwibGFzdG5hbWUiOm51bGwsImZpcnN0bmFtZSI6bnVsbCwicGhvbmUxIjpudWxsLCJwaG9uZTIiOm51bGwsInBob25lMyI6bnVsbCwidGFnIjpudWxsLCJhdmFpbGFiaWxpdHkiOm51bGwsImxhbmd1YWdlIjpudWxsLCJvZmZpY2UiOm51bGwsInBvc3RhbGNvZGUiOm51bGwsImNpdHkiOm51bGwsImFkZHJlc3MxIjpudWxsLCJhZGRyZXNzMiI6bnVsbCwiYXBwbGljYXRpb24iOiJ0ZXN0IiwidmFsaWRhdGVkIjoxLCJvcmdhbmlzYXRpb24iOiIiLCJjcmVhdGlvbmRhdGUiOiIyMDE4LTA1LTA4VDExOjIyOjQ0LjAwMFoiLCJ1cGRhdGVkYXRlIjoiMjAxOC0wNS0wOFQxMToyMjo0NC4wMDBaIiwiaWF0IjoxNTMxNDIyNzA4fQ.yI1oHlTxo5q9-WRgg-9d5E_cVUpaTJty2L-j3xXJGkk";
        //return this.connexionTokenService.getToken(this.storageKey);
    }

    getConfiguration() {
        return this.toolbox.readFromStorage(this.keys.configurationKey);
        // return this.configurationService.get(this.configurationKey);
    }

    callbackToast(data: any, message: string) {
        this.toastController.create({
            message: message,
            duration: 2000,
            position: 'bottom'
        }).present();
    }

    scan(navController: any, successPageToLoad: any, successPageParameters: any, failurePageToLoad: any, failurePageParameters: any, pageOpenType) {
        // //             to be removed before deploying

        //         this.scanFake(navController, successPageToLoad, successPageParameters, failurePageToLoad, failurePageParameters, pageOpenType);
        //         return;

        this.barcodeScanner.scan().then(barcodeData => {
            if (!barcodeData.cancelled) {
                if (!successPageParameters) {
                    successPageParameters = {};
                }
                successPageParameters.scanText = barcodeData.text;
                if (pageOpenType == 0) {
                    navController.setRoot(successPageToLoad, successPageParameters);
                } else {
                    navController.push(successPageToLoad, successPageParameters);
                }
            }
            if (barcodeData.cancelled && failurePageToLoad) {
                if (pageOpenType == 0) {
                    navController.setRoot(failurePageToLoad, failurePageParameters);
                } else {
                    navController.push(failurePageToLoad, failurePageParameters);
                }
            }
        }).catch(err => {
            console.log('Error', err);
        });
        

    }

    scanFake(navController: any, successPageToLoad: any, successPageParameters: any, failurePageToLoad: any, failurePageParameters: any, pageOpenType: number = 0) {
        if (!successPageParameters) {
            successPageParameters = {};
        }
        successPageParameters.scanText = "5dd01066401005";
//        successPageParameters.scanText = "5601066401005";
        if (pageOpenType == 0) {
            navController.setRoot(successPageToLoad, successPageParameters);
        } else {
            navController.push(failurePageToLoad, failurePageParameters);
        }
    }

    writeConnexion(googleUser: any) {
        let dat: any = {};
        dat.googleSignIn = true;
        dat.type = "connexion";
        dat.decoded = googleUser;
        dat.connexionId = this.toolbox.getUniqueId();
        this.toolbox.writeToStorage(this.keys.connexionKey, dat, true);
    }

    removeConnexion() {
        this.toolbox.removeFromStorage(this.keys.connexionKey);
    }

    showLoading(message = "Please wait") {
        let loadingSpinner = this.loadingCtrl.create({
            content: this.miscellaneousService.translate(message)
        });
        loadingSpinner.present();
        return loadingSpinner;
    }

    stopLoading(loadingSpinner: any) {
        if (loadingSpinner) {
            loadingSpinner.dismiss();
        }
    }

    formatDate(date: String) {
        return date;
    }

    translate(text: string) {
        return this.miscellaneousService.translate(text);
    }

    localNotify(localNotifications: any, message: string) {
        localNotifications.schedule({
            text: message,
            led: 'FF0000'
        });
    }

    webNotify(webNotificationAllowed: string, message: string) {
        if (webNotificationAllowed === "granted") {
            var options: NotificationOptions = {
                // "requireInteraction": true
            }
            new Notification(message, options);
        }
    }

    isMobileDevice() {
        return this.platform.is('cordova');
    }

    isMobile() {
        return this.platform.is('mobile') || this.platform.is('cordova');
    }

    isHorizontal(){
        return this.platform.isLandscape(); 
        //this.screenOrientation.type == 'landscape';// this.screenOrientation.ORIENTATIONS.LANDSCAPE;
    }

    getNotificationMessage(count: number) {
        let ret = "";
        ret = this.translate(count + " note(s) have be modified or created");
        return ret;
    }

    notify(localNotifications: any, webNotificationAllowed: string, message: string) {
        if (message) {
            if (this.isMobile()) {
                this.localNotify(localNotifications, message);
            } else {
                this.webNotify(webNotificationAllowed, message);
            }
        }
    }

    getFirstLetter(text: string) {
        if (text && text.length > 0) {
            return text[0];
        }
        return "";
    }

    isValidUrl(url: string) {
        if (url) {
            return url.startsWith("http://") || url.startsWith("https://");
        } else {
            return false;
        }
    }

    getLatestVersion(callbackSuccess: Function, callbackFailure: Function) {
        let url = this.versionFileUrl;
        this.http.get(url).subscribe(
            (data: any) => {
                let ret = this.toolbox.parseJson(data._body);
                if (callbackSuccess) {
                    callbackSuccess(ret)
                }
            },
            (error: any) => {
                console.log(error);
                if (callbackFailure) {
                    callbackFailure(error)
                }
            }
        );
    }    
}