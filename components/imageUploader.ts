import { Component, Input, Output, EventEmitter } from '@angular/core';

import { GenericComponent } from './generic.component';
import { MiscellaneousService } from '../services/miscellaneous.service';

import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CustomService } from '../../services/custom.service';
import { SettingService } from '../../services/setting.service';

@Component({
    selector: 'imageUploader',
    templateUrl: 'imageUploader.html'
})

export class ImageUploaderComponent extends GenericComponent {

    @Input() apiUrl: string = null;
    @Input() itemPlus: any;
    @Output() uploaded = new EventEmitter();

    imageURI: any;
    imageFileName: any;
    error: string;
    data: any;
    autoUpload: boolean = true;
    loading: boolean;

    constructor(public miscellaneousService: MiscellaneousService, public navCtrl: NavController,
        private transfer: FileTransfer, public customService: CustomService, private settingService: SettingService,
        private camera: Camera,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController) {
        super(miscellaneousService);
    }

    getImage(source: number) {
        let sou = source == 0 ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY;
        // alert(this.settingService.getItemPlusImageQuality());
        let quality: number = Number.parseInt(this.settingService.getItemPlusImageQuality());
        let allowEdit: boolean = this.settingService.getItemPlusImageEdit();
        const options: CameraOptions = {
            quality: quality,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: sou,
            allowEdit: allowEdit
        }
         
        this.camera.getPicture(options).then((imageData) => {
            this.imageURI = imageData;
            this.customService.callbackToast(null, this.translate("Image taken"));
            if (this.autoUpload) {
                this.uploadFile();
            }
        }, (err) => {
            console.log(err);
            this.customService.callbackToast(err, this.translate("Error taking picture"));
        });
    }

    uploadFile() {
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
            params: { itemPlus: this.itemPlus, imageBaseUrl: this.configuration().apiUpload.imageBaseUrl }
        }

        fileTransfer.upload(this.imageURI, this.apiUrl, options)
            .then(
                (data: any) => {
                    let resp = this.toolbox.parseJson(data.response);
                    this.data = JSON.stringify(resp);
                    console.log(data);
                    loader.dismiss();
                    this.customService.callbackToast(data, this.translate("Image uploaded successfully"));
                    this.uploaded.emit(data.response);
                    this.loading = false;
                },
                (err: any) => {
                    console.error(err);
                    loader.dismiss();
                    this.error = JSON.stringify(err);
                    this.customService.callbackToast(err, this.translate("Error uploading image"));
                    this.loading = false;
                });
    }



}