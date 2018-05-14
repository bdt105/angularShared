import { Injectable } from "@angular/core";

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Toolbox } from "bdt105toolbox/dist";
import { ConnexionTokenService } from 'bdt105angularconnexionservice';

@Injectable()
export class AuthGuard implements CanActivate{

    private toolbox: Toolbox = new Toolbox();
    
    constructor(private router: Router, public connexionTokenService: ConnexionTokenService){

    }

    canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let conn = this.connexionTokenService.isConnected();
        if (!conn){
            this.toolbox.writeToStorage("redirectUrl", state.url, true);
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }

}