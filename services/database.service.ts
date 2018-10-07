import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Toolbox } from 'bdt105toolbox/dist';

@Injectable()
export class DatabaseService {

    private toolbox: Toolbox = new Toolbox();
    protected token: string;
    protected baseUrl: string;

    // private callback(data: any, callback: Function) {
    //     if (data && data.status != 200) {
    //         console.log(data);
    //     }
    //     let ret = this.toolbox.parseJson(data._body);
    //     if (callback) {
    //         callback(ret);
    //     }
    // }

    constructor(public http: HttpClient, token: string, baseUrl: string) {
        this.token = token
        this.baseUrl = baseUrl
    }

    newRecord(callbackSuccess: Function, callbackFailure: Function, tableName: string) {
        let body: any =
        {
            "token": this.token,
            "tableName": tableName
        }

        this.http.post(this.baseUrl + "table/fresh", body).subscribe(
            (data: any) => callbackSuccess(data),
            (error: any) => callbackFailure(error)
        );

    }

    saveRecord(callbackSuccess: Function, callbackFailure: Function, tableName: string, idFieldName: string, object: any) {
        let body = {
            "token": this.token,
            "tableName": tableName,
            "idFieldName": idFieldName,
            "object": object
        }

        this.http.put(this.baseUrl + "table", body).subscribe(
            (data: any) => callbackSuccess(data),
            (error: any) => callbackFailure(error)
        );
    }

    deleteRecord(callbackSuccess: Function, callbackFailure: Function, tableName: string, where: string) {
        let body =
        {
            "token": this.token,
            "tableName": tableName,
            "where": where
        };

        this.http.delete(this.baseUrl + "table", { "params": body }).subscribe(
            (data: any) => callbackSuccess(data),
            (error: any) => callbackFailure(error)
        );
    }

    loadTable(callbackSuccess: Function, callbackFailure: Function, tableName: string, where: string,
        offset: number = null, limit: number = null, searchTerm: string = null, orderBy: string = null, select: string = null) {

        let body: any =
        {
            "token": this.token,
            "tableName": tableName,
            "orderby": orderBy,
            "where": where,
            "limit": limit,
            "offset": offset,
            "searchTerm": searchTerm,
            "select": select
        }

        if (offset && limit) {
            body.offset = offset;
            body.limit = limit;
        }

        this.http.post(this.baseUrl + "table", body).subscribe(
            (data: any) => callbackSuccess(data),
            (error: any) => callbackFailure(error)
        );
    }

    loadQuery(callbackSuccess: Function, callbackFailure: Function, sql: string, where: string,
        offset: number = null, limit: number = null, orderBy: string = null, select: string = null, groupby: string = null, extra: string = null) {

        let body: any =
        {
            "token": this.token,
            "sql": sql,
            "orderby": orderBy,
            "where": where,
            "limit": limit,
            "offset": offset,
            "groupby": groupby,
            "extra": extra,
            "select": select
        }

        this.http.post(this.baseUrl + "query", body).subscribe(
            (data: any) => callbackSuccess(data),
            (error: any) => callbackFailure(error)
        );
    }

}
