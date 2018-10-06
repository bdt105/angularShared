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

    generateFields(fields: any){
        if (fields){
            let ret = [];
            for (var i=0; i < fields.length; i++){
                let type: string = "text";
                if (fields[i].Type.startsWith("int")) {
                    type = "number";
                }
                if (fields[i].Type.startsWith("date")) {
                    type = "datetime";
                }
                let field = {"name": fields[i].Field, "label": this.translate(fields[i].Field), "type": type}
            }
        }
    }
}