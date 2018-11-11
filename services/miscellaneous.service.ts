import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';

import { ConfigurationService } from "bdt105angularconfigurationservice";
import { ConnexionTokenService } from 'bdt105angularconnexionservice';

@Injectable()
export class MiscellaneousService {

    private toolbox: Toolbox = new Toolbox();
    public configurationKey: string;
    public settingKey: string;
    public translateKey: string;
    public connexionKey: string;
    public currentLanguage: any;

    constructor(public configurationService: ConfigurationService, public connexionTokenService: ConnexionTokenService) {
    }

    private get() {
        let obj = this.toolbox.readFromStorage(this.configurationKey);
        return obj;
    }

    configuration() {
        return this.get();
    }

    translate(text: string) {
        let translateData = this.toolbox.readFromStorage(this.translateKey);
        if (translateData && translateData.length > 0 && this.currentLanguage) {
            let trans = this.toolbox.filterArrayOfObjects(translateData, "key", text, true, true, true, false);
            if (trans && trans.length > 0) {
                let value = trans[0].value;
                return value[this.currentLanguage];
            }
        }
        return text;
    }

    translation() {
        return this.get();
    }

    getConfigurationPromise() {
        return this.configurationService.load(this.configurationKey, "./assets/configuration.json", true);
    }

    getTranslationPromise() {
        return this.configurationService.load(this.configurationKey, "./assets/configuration.json", true);
    }

    isConnected() {
        return this.connexionTokenService.isConnected(this.connexionKey);
    }

    getCurrentUser() {
        return this.connexionTokenService.getUser(this.connexionKey);
    }

    getApplicationName() {
        return this.configuration().common.applicationName;
    }

    storeConnexion(data: any, forever: boolean) {
        this.toolbox.writeToStorage(this.connexionKey, data, forever);
    }

    cleanConnexion() {
        this.toolbox.removeFromStorage(this.connexionKey);
    }


}
