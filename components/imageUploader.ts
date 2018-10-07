import { Component, Input, Output, EventEmitter } from '@angular/core';

import { GenericComponent } from './generic.component';
import { MiscellaneousService } from '../services/miscellaneous.service';

import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
    selector: 'imageUploader',
    templateUrl: 'imageUploader.html'
})

export class ImageUploaderComponent extends GenericComponent {

    @Input() apiUrl: string = null;
    @Input() params: any;
    @Input() imageQuality: number;
    @Input() imageAllowEdit: boolean;
    @Output() uploadOk = new EventEmitter();
    @Output() uploadNok = new EventEmitter();

    imageURI: any;
    imageFileName: any;
    error: string;
    data: any;
    autoUpload: boolean = true;
    loading: boolean;

    constructor(public miscellaneousService: MiscellaneousService, public navCtrl: NavController, private transfer: FileTransfer,
        private camera: Camera,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController) {
        super(miscellaneousService);
    }

    getImage(source: number) {
        let sou = source == 0 ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY;
        // alert(this.settingService.getItemPlusImageQuality());
        // let quality: number = Number.parseInt(this.settingService.getItemPlusImageQuality());
        // let allowEdit: boolean = this.settingService.getItemPlusImageEdit();
        const options: CameraOptions = {
            quality: this.imageQuality ? this.imageQuality : 50,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: sou,
            allowEdit: this.imageAllowEdit
        }
         
        this.camera.getPicture(options).then((imageData) => {
            this.imageURI = imageData;
            // this.customService.callbackToast(null, this.translate("Image taken"));
            if (this.autoUpload) {
                this.uploadFile(this.params);
            }
        }, (err) => {
            console.log(err);
            // this.customService.callbackToast(err, this.translate("Error taking picture"));
        });
    }

    uploadFile(params: any) {
        let loader = this.loadingCtrl.create({
            content: this.translate("Uploading...")
        });

        this.loading = true;

        // loader.present();
        const fileTransfer: FileTransferObject = this.transfer.create();

        let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: 'file',
            chunkedMode: false,
            mimeType: "image/jpeg",
            headers: {},
            params: params/*{ itemPlus: this.itemPlus, imageBaseUrl: this.configuration().apiUpload.imageBaseUrl }*/
        }

        fileTransfer.upload(this.imageURI, this.apiUrl, options)
            .then(
                (data: any) => {
                    let resp = this.toolbox.parseJson(data.response);
                    this.data = JSON.stringify(resp);
                    console.log(data);
                    loader.dismiss();
                    this.uploadOk.emit(data.response);
                    this.loading = false;
                },
                (error: any) => {
                    console.error(error);
                    loader.dismiss();
                    this.uploadOk.emit(error);
                    this.error = JSON.stringify(error);
                    this.loading = false;
                });
    }



}