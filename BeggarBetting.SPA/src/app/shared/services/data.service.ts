import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IDailySchedule, IMatchInfo } from './../interfaces';
import { Injectable } from '@angular/core';
//Grab everything with import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {

    _baseUrl: string = '';  
    
    constructor(private http: HttpClient) 
    {
        this._baseUrl = environment.apiEndpoint;
    }
   
    // Get schedule based on league
    getDailySchedules(league: string): Observable<IDailySchedule[]> {  
        let params = new HttpParams();
        params = params.append('league', league);    
        return this.http.get(this._baseUrl + 'schedule/DailySchedules', { params: params })
            .map(result => result)
            .catch(this.handleError);
    } 
  
    getDailySchedule(): Observable<IDailySchedule[]> {     
        return this.http.get(this._baseUrl + 'schedule/DailySchedule')
            .map(result => result)
            .catch(this.handleError);
    } 

    getMatchInfo(matchIds: string[]): Observable<IMatchInfo[]> {          
        let params = new HttpParams();
        matchIds.forEach(id => {
            params = params.append('matchIds', id);
        });
        return this.http.get(this._baseUrl + 'schedule/MatchInfo', { params: params })
            .map(result => result)
            .catch(this.handleError);
    } 

    GetTimeCheck(matchId: string, league: string): Observable<boolean> {  
        let params = new HttpParams();
        params = params.append('matchId', matchId);    
        params = params.append('league', league);
        return this.http.get(this._baseUrl + 'schedule/TimeCheck', { params: params })        
            .map(result => result)
            .catch(this.handleError);
    }  

    private handleError(error: any) {
        var applicationError = error.headers.get('Application-Error');
        var serverError = error.json();
        var modelStateErrors: string = '';

        if (!serverError.type) {
            for (var key in serverError) {
                if (serverError[key])
                    modelStateErrors += serverError[key] + '\n';
            }
        }

        modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

        return Observable.throw(applicationError || modelStateErrors || 'Server error');
    }
}