import { Component, OnInit, ViewChild } from '@angular/core';
import { PlanningService } from 'src/app/core/service/planning.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import  mogadorServerIPs from  '../assets/mogadorServerIPs.json'

export class SubmitObj {
  loading: boolean;
  errorObj: {
    isError: boolean;
    message: string;
  };
}


@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css']
})
export class PlanningComponent implements OnInit {
    breadscrums = [
      {
        title: 'Planning ',
        items: ['Dashboard'],
        active: 'Planning'
      }
    ];
    loadingPlanning = true;
    isFullFeedPlanning = false;
    planning: any[] = [];
    rangeForm: FormGroup;


    deleteId: any;
    titleKey: string = '';
    loading: boolean = true;
    isFullFeed: boolean = false;
    isDeleting: boolean = false;
    isNoData: boolean = false;
    todayDate: Date =  new Date();
    today : string =  new Date().toLocaleDateString();
    after2MonthsDate: Date = new Date(new Date().setMonth(new Date().getMonth()+2))
    after2Months: string = this.after2MonthsDate.toLocaleDateString()
    ip:string= "192.168.2.222:8000"
    mogadorServers:any = mogadorServerIPs

    readonly errorObjInit = {
      isError: false,
      message: ''
    };

    errorObj = {
      isError: false,
      message: ''
    };

    displayedColumns: string[] = [
      'dat',
      // 'libdat',
      // 'typch',
      'libch',
      'cap',
      'resha',
      'surall',
      'allo',
      'occup',
      'listatt',
      'disp',
      'pouroccup',
      'pourglob',
      'totpaxres'
    ];

    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    //Pagination Variables & Functions
    readonly pageSize: number = 25;
    readonly pageSizeOptions: number[] = [25, 50, 100];

    pagination = {
      totalRows: 0,
      pageSize: this.pageSize,
      pageSizeOptions: this.pageSizeOptions,
      currentPage: 0
    };


    constructor(
      private planningService: PlanningService,
      private router: Router,
      private route: ActivatedRoute,
      private fb: FormBuilder

    ) {}


    ngOnInit() {

      console.log(mogadorServerIPs)
      this.rangeForm = this.fb.group({
        dateRangeStart: [this.todayDate,  [Validators.required]],
        dateRangeEnd: [this.after2MonthsDate, [Validators.required]],
        serverIp: [mogadorServerIPs[0].ip, [Validators.required]],
      });

      this.getPlanning(this.mogadorServers[0].ip,this.today,this.after2Months);
    }


    dateRangeChange(  dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement ) {
        const dateStart = dateRangeStart.value
        const dateEnd =   dateRangeEnd.value
        if(dateRangeStart.value != "" && dateRangeEnd.value != ""){
          this.getPlanning(mogadorServerIPs[0].ip,dateStart,dateEnd)
        }
    }

    public getPlanning(ip,dateStart,dateEnd) {
      this.errorObj = { ...this.errorObjInit };
      this.loadingPlanning=true
      this.isFullFeedPlanning = false;
      this.planningService.getPlanning(this.ip,dateStart,dateEnd).subscribe({
        next: (response: any) => {
          this.loadingPlanning = false;
          this.isFullFeedPlanning = true;
          this.isNoData = response.length === 0;
          this.planning = response;
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error)
          this.loadingPlanning = false;
          this.isFullFeedPlanning = false;
          this.errorObj.isError = true;
          this.errorObj.message = error?.error?.message || error;
        }
      });
    }

    selectHotel(event: MatSelectChange) {
      console.log(event.value);
      const ip=event.value
      console.log(this.rangeForm.value)
    }
  }
