import { Component, OnInit, trigger, transition, style, animate, Input } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DataService } from '../shared/services/data.service';
import { NotificationService } from '../shared/utils/notification.service';
import { CavService } from '../shared/services/cav.service';
import { IDailySchedule } from '../shared/interfaces';

@Component({
  selector: 'daily-schedule',
  templateUrl: './dailyschedule.component.html',
  animations: [
    trigger('easeInOut', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate("1s ease-in-out", style({
          opacity: 1
        }))
      ]),
      transition(':leave', [
        style({
          opacity: 1
        }),
        animate("1s ease-in-out", style({
          opacity: 0
        }))
      ])
    ])
  ]
})
export class DailyscheduleComponent implements OnInit {
  @Input() bettingPrice: number;
  @Input() hasLoggedIn: boolean;
  schedules: IDailySchedule[];
  hasNoEvents: boolean = false;
  date: string;
  hasStarted: boolean = false;
  bet: number;
  transactionScope: any;

  constructor(private dataService: DataService,    
              private notificationService: NotificationService,
              private spinnerService: Ng4LoadingSpinnerService,
              private cavService: CavService) { }

  ngOnInit() {
    this.loadSchedules();
  }

  loadSchedules(): void {    
    this.spinnerService.show();  
    this.dataService.getDailySchedule()
    .subscribe((res: IDailySchedule[]) => {
        this.schedules = res; 
        let date: string = "";  
        for (let sc of this.schedules) { 
          sc.homeTeamScore = null; // Initialize
          sc.awayTeamScore = null; // Initialize
          sc.bettingPrice = this.bettingPrice // Initialize          
         
          this.cavService.getNumOfBettersForMatchAndPrice(sc.matchId, this.bettingPrice)
          .then((value) => {        
            sc.numOfBetters = value;         
          });             
          
          this.bet = this.bettingPrice;
          date = sc.date; // In case there's no events for the date requested               
        }        
        if (this.schedules.length == 1 && this.schedules[0].hasNoEvents) {
            this.hasNoEvents = true;   
            this.date = date;    
        }
        
        this.spinnerService.hide();

        if (this.hasNoEvents)
          this.notificationService.printSuccessMessage('No events today!');         
        else              
          this.notificationService.printSuccessMessage('Daily schedule loaded!');      
    },
    error => {           
        this.notificationService.printErrorMessage('Failed to load the schedule.');
        this.spinnerService.hide();
    });  
  }

  checkTimeExpired(event): void {    
    if (event === 0) 
      this.loadSchedules();
  } 

   // Reload the number of participants after the bet is successfully submitted
  successFromConfirmModal(event): void {
    if (event > 0) {
      for (let sc of this.schedules) {
        if (sc.matchId === event) {
          var result = this.cavService.getNumOfBettersForMatchAndPrice(sc.matchId, sc.bettingPrice);
          result.then((value) => {
            sc.numOfBetters = value;
          })  
        }
      }
    }
  }

  getScope(event): void {
    this.transactionScope = event;
  }
}