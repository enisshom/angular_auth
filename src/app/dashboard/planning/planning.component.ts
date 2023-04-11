import { Component, OnInit, ViewChild } from '@angular/core';
import { Client } from '../../core/models/client.model';
import { ClientService } from '../../core/service/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    after2Months: string = new Date(this.todayDate.setMonth(this.todayDate.getMonth()+2)).toLocaleDateString()

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
      'libdat',
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

    clients: Client[] = [];
    constructor(
      private clientService: ClientService,
      private router: Router,
      private route: ActivatedRoute,
      private fb: FormBuilder

    ) {
      this.rangeForm = this.fb.group({
        dateRangeStart: [this.todayDate,  [Validators.required]],
        dateRangeEnd: [new Date(2021, 7, 7), [Validators.required]],
      });

    }

    ngOnInit() {



      this.getPlanning(this.today,this.after2Months);
      // console.log(new Date().toLocaleDateString())
      // const today  = new Date()
      // console.log(new Date(today.setMonth(today.getMonth()+2)).toLocaleDateString())
      // const after2Months = new Date(today.setMonth(today.getMonth()+2)).toLocaleDateString()
    }


    dateRangeChange(  dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement ) {
        console.log(dateRangeStart.value)
        console.log(dateRangeEnd.value)
        const dateStart = dateRangeStart.value
        const dateEnd =   dateRangeEnd.value
        if(dateRangeStart.value != "" && dateRangeEnd.value != ""){

          this.getPlanning(dateStart,dateEnd)
        }
    }



    public getPlanning(dateStart,dateEnd) {
      console.log(dateStart)
      console.log(dateEnd)
      this.errorObj = { ...this.errorObjInit };
      this.loadingPlanning=true
      this.isFullFeedPlanning = false;
      this.clientService.getPlanning(dateStart,dateEnd).subscribe({
        next: (response: any) => {
          console.log('planning');
          console.log(response);
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
  }
