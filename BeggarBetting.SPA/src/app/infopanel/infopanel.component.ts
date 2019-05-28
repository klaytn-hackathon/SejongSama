import { TestBed } from '@angular/core/testing';
import { Component, OnInit, trigger, transition, style, animate, Input, ViewChild } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DataService } from '../shared/services/data.service';
import { NotificationService } from '../shared/utils/notification.service';
import { CavService } from '../shared/services/cav.service';
import { IDailySchedule } from '../shared/interfaces';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'info-panel',
  templateUrl: './infopanel.component.html',
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
export class InfopanelComponent implements OnInit { 
  @ViewChild('infopanel') public infopanel: ModalDirective;
  numOfPanhandler: number;
  numOfVagabond: number;
  numOfTramp: number;
  numOfMiddleClass: number;  
  display: boolean = false;
  
  constructor(private cavService: CavService) { }

  ngOnInit() {
    this.loadInfoPanel();
  }

  loadInfoPanel(): void { 
    this.cavService.getInfoPanel()
      .then((value) => {        
        this.handleInfoPanel(value);      
    });  
  }

  handleInfoPanel(value): void {
    this.numOfPanhandler = 12;
    this.numOfVagabond = 6;
    this.numOfTramp = 3;
    this.numOfMiddleClass = 1;
  } 

  showDialog() {
    this.display = true;
  }
}