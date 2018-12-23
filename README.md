# angularShared

Shared components and services for angular applications

Installation

npm install bdt105angularconfigurationservice
npm install bdt105toolbox
npm install bdt105angularconnexionservice

ionic cordova plugin add cordova-plugin-file-transfer
npm install --save @ionic-native/file-transfer

ionic cordova plugin add cordova-plugin-camera
npm install --save @ionic-native/camera

ionic cordova plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID=myreversedclientid
npm install --save @ionic-native/google-plus

ionic cordova plugin add cordova-plugin-x-socialsharing

Into app.module.ts:

// shared services
import { ConnexionTokenService } from 'bdt105angularconnexionservice';
import { MiscellaneousService } from '../angularShared/services/miscellaneous.service';
import { ConfigurationService } from 'bdt105angularconfigurationservice';
import { GoogleService } from '../angularShared/services/google.service';
import { DatabaseService } from '../angularShared/services/database.service';
import { GooglePlus } from '@ionic-native/google-plus';

providers: [
    AppService,
    ConnexionTokenService,
    MiscellaneousService,
    ConfigurationService,
    GoogleService,
    DatabaseService,
    GooglePlus,
    ...
]
