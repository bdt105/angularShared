import { Component, Input } from '@angular/core';

@Component({
    selector: 'progressBar',
    template: `
        <div class="progress-outer" [innerHtml]="caption">
            <div class="progress-inner" [style.width]="getPourcentage() + '%'"></div>
        </div>`,
    // styles: [`
    //     .progress-outer {
    //         width: 96%;
    //         margin: 10px 2%;
    //         padding: 3px;
    //         text-align: center;
    //         background-color: red;
    //         border: 1px solid #dcdcdc;
    //         color: #fff;
    //         border-radius: 20px;
    //     }
     
    //     .progress-inner {
    //         min-width: 15%;
    //         white-space: nowrap;
    //         overflow: hidden;
    //         padding: 5px;
    //         border-radius: 20px;
    //         color: black;
    //         background-color: map-get($colors, secondary);
    //     }`
    // ]
})

export class ProgressBarComponent {

    private __progressionIndex: number;
    private __maxIndex: number;

    @Input() caption : string;

    @Input() set progressionIndex(value: number){
        this.__progressionIndex = value;
    }
    get progressionIndex(){
        return this.__progressionIndex;
    }
    @Input() set maxIndex(value: number){
        this.__maxIndex = value;
    }
    get maxIndex(){
        return this.__maxIndex;
    }

    constructor() {

    }

    private getPourcentage(){
        let p = this.__maxIndex && this.__maxIndex != 0 ? Math.round((this.__progressionIndex ? this.__progressionIndex : 0) / this.__maxIndex) * 100: 0; 
        return p;
    }

}