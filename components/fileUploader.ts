import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { GenericComponent } from './generic.component';
import { MiscellaneousService } from '../services/miscellaneous.service';

/**
 * Usage
 *
 *  <fileUploader [apiUrl]="apiUrl" [params]="uploadParams"></fileUploader>
 *
 *  <fileUploader [apiUrl]="apiUrl" [params]="[{'key':'language_code', 'value': 'en'}]"></fileUploader>
 *
 */

@Component({
    selector: 'fileUploader',
    templateUrl: 'fileUploader.html'
})

export class FileUploaderComponent extends GenericComponent {
    @ViewChild('file') fileInput: ElementRef;

    @Input('apiUrl') apiUrl: string = null;

    @Input('params') params: Array<{ key: string, value: string }> = [];

    @Input('buttonText') buttonText: string = 'Upload';

    @Input('buttonType') buttonType: 'button' | 'icon' = 'icon';

    @Input('icon') icon: string = 'share';

    // @Input('onUploadSuccess') onUploadSuccess: (file: File, response: any) => void
    //     = function (file: File, response: any) {
    //         console.log(file); 
    //         console.log(response);
    //         this.uploaded.emit(response);
    //     };

    @Input('onUploadError') onUploadError: (file: File) => void = function (error: any) { console.log(error) };
    @Output() uploadedOk = new EventEmitter();
    @Output() fileChosen = new EventEmitter();
    @Output() uploadedNOk = new EventEmitter();

    fileToUpload: File = null;
    loadingSpinner: any;

    constructor(public miscellaneousService: MiscellaneousService, private http: Http) {
        super(miscellaneousService);
    }

    triggerFileInputClick() {
        this.fileInput.nativeElement.click();
    }

    onFileInputChange(files: FileList) {
        this.fileToUpload = files.item(0);
        this.fileChosen.emit(this.fileToUpload);

        if (this.fileInput.nativeElement.value != '') {
            //this.upload();
        }
    }

    upload(params: any) {
        const formData: FormData = new FormData();

        formData.append('file', this.fileToUpload, this.fileToUpload.name);

        params.map(param => {
            formData.append(param.key, param.value);
        });

        this.http
            .post(this.apiUrl, formData)
            // .map(() => { return true; })
            .subscribe(response => {
                this.uploadedOk.emit({"file": this.fileToUpload, "response": response});
                // this.onUploadSuccess(this.fileToUpload, response);
                this.fileInput.nativeElement.value = '';
            }, error => {
                this.uploadedNOk.emit({"response": error});
                this.onUploadError(error);
                this.fileInput.nativeElement.value = '';
            });
    }
}