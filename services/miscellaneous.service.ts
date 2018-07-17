import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';

import { ConfigurationService } from "bdt105angularconfigurationservice";
import { ConnexionTokenService } from 'bdt105angularconnexionservice';

@Injectable()
export class MiscellaneousService {

    private toolbox: Toolbox = new Toolbox(); 
    public configurationKey = "configurationQuestionnaire";
    public translateKey = "translateQuestionnaire";
    public connexionKey = "connexionQuestionnaire";

    constructor(public configurationService: ConfigurationService, public connexionTokenService: ConnexionTokenService){
    }

    private get(storageKey: string, timer: number){
        let obj = this.toolbox.readFromStorage(this.configurationKey);
        return obj;
    }

    configuration(){
        return this.get(this.configurationKey, 3000);
    }

    translate(text: string){
        let translateData = this.get(this.translateKey, 3000);
        if (translateData){
            let t = this.toolbox.filterArrayOfObjects(translateData, "key", text);
            if (t && t.length > 0){ 
                return t[0].value;
            }
        }
        return text;
    }

    translation(){
        return this.get(this.translateKey, 3000);
    }

    getConfigurationPromise(){
        return this.configurationService.load(this.configurationKey, "./assets/configuration.json", true);
    }

    getTranslationPromise(){
        return this.configurationService.load(this.configurationKey, "./assets/configuration.json", true);
    }

    isConnected(){
        return this.connexionTokenService.isConnected(this.connexionKey);        
    }

    getCurrentUser(){
        return this.connexionTokenService.getUser(this.connexionKey);
    }

    getApplicationName(){
        return this.configuration().common.applicationName;
    }

    storeConnexion(data: any, forever: boolean){
        this.toolbox.writeToStorage(this.connexionKey, data, forever);        
    }

    cleanConnexion(){
        this.toolbox.removeFromStorage(this.connexionKey);        
    }

    
}
