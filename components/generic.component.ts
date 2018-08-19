import { OnInit } from '@angular/core';

import { MiscellaneousService } from '../services/miscellaneous.service';
import { Toolbox } from 'bdt105toolbox/dist';

export class GenericComponent implements OnInit{

    public toolbox: Toolbox = new Toolbox();

    constructor(public miscellaneousService: MiscellaneousService){
    }

    ngOnInit(){

    }

    translate(text: string){
        return this.miscellaneousService.translate(text);
    } 

    configuration(){
        return this.miscellaneousService.configuration();
    }
    

    isConnected(){
        return this.miscellaneousService.isConnected();
    }
}