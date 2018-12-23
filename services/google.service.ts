import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { Google } from 'bdt105google/dist';

declare const gapi: any;

@Injectable()

export class GoogleService {

    protected token: string;
    protected baseUrl: string;

    google: any;

    constructor(private googlePlus: GooglePlus) {
        try {
            //this.google = new Google(null);
        } catch (error) {
            console.error(error);
        }
    }

    logoutWeb(callbackSuccess: Function, callbackFailure: Function) {
        if (this.google) {
            this.google.signOut(() => {
                callbackSuccess(null);
            });
        }
    }

    loginMobile(callbackSuccess: Function, callbackFailure: Function) {
        this.googlePlus.login({})
            .then(res => {
                res.isLoggedIn = true;
                callbackSuccess(res);
            })
            .catch(err => {
                callbackFailure(err);
            }
            );
    }

    logoutMobile(callbackSuccess: Function, callbackFailure: Function) {
        if (this.googlePlus) {
            this.googlePlus.logout()
                .then(res => {
                    callbackSuccess(res);
                })
                .catch(err => {
                    callbackFailure(err);
                });
        } else {
            callbackFailure(null);
        }
    }

    loginWeb(callbackSuccess: Function, callbackFailure: Function) {
        let dat: any = {};
        let callback = (googleUser: any) => {
            if (googleUser) {
                dat.googleSignIn = true;
                dat.type = "connexion";
                dat.decoded = googleUser.getBasicProfile();
                dat.decoded.email = dat.decoded.U3;
                dat.decoded.firstname = dat.decoded.ofa;
                dat.decoded.lastname = dat.decoded.wea;
                dat.decoded.imageUrl = dat.decoded.Paa;
                dat.decoded.token = googleUser.getAuthResponse().id_token;
                callbackSuccess(dat);
            } else {
                callbackFailure(null);
            }
        }
        if (gapi) {
            this.google.signIn(
                (data: any) => callback(data)
            );
        }
    }
}