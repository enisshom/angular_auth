import { Component, OnInit, ViewChild } from '@angular/core';
import { PlanningService } from 'src/app/core/service/planning.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import mogadorServerIPs from '/assets/mogadorServerIPs.json';
import { debounceTime, distinctUntilChanged, map, startWith, tap } from 'rxjs';
import { format } from 'date-fns';

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
  searchForm: FormGroup;
  dateStart: any = '';
  dateEnd: any = '';
  serverIp: any = '';

  deleteId: any;
  titleKey: string = '';
  loading: boolean = true;
  isFullFeed: boolean = false;
  isDeleting: boolean = false;
  isNoData: boolean = false;
  todayDate: Date = new Date();
  today: string = new Date().toLocaleDateString();
  after2MonthsDate: Date = new Date(
    new Date().setMonth(new Date().getMonth() + 2)
  );
  after2Months: string = this.after2MonthsDate.toLocaleDateString();
  mogadorServers: any = mogadorServerIPs;

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
    public planningService: PlanningService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    console.log(format(this.todayDate, 'dd/MM/yyyy'));
    // console.log(this.planningService.connected())
    this.dateStart = format(this.todayDate, 'dd/MM/yyyy');
    this.dateEnd = format(this.after2MonthsDate, 'dd/MM/yyyy');
    this.serverIp = mogadorServerIPs[0].ip;
    this.searchForm = this.fb.group({
      dateRangeStart: [this.todayDate, [Validators.required]],
      dateRangeEnd: [this.after2MonthsDate, [Validators.required]],
      serverIp: [mogadorServerIPs[0].ip, [Validators.required]]
    });

    // this.searchForm.valueChanges.pipe(
    //     startWith(),
    //     debounceTime(1000),
    //     distinctUntilChanged(),
    //     tap((val) => {
    //       console.log(val)
    //     }),
    //     map((value: any) => {
    //       return value;
    //     })
    //   )
    //   .subscribe((result: any) => {
    //     console.log(result);
    //     this.getPlanning( result.serverIp, result.dateRangeStart, result.dateRangeEnd );
    //   });

    this.getPlanning(this.mogadorServers[0].ip, this.today, this.after2Months);
  }
  dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    if (dateRangeStart.value != '' && dateRangeEnd.value != '') {
      this.dateStart = dateRangeStart.value;
      this.dateEnd = dateRangeEnd.value;
      this.serverIp = this.searchForm.controls['serverIp'].value;

      this.getPlanning(this.serverIp, this.dateStart, this.dateEnd);
    }
  }

  public getPlanning(serverIp, dateStart, dateEnd) {
    this.errorObj = { ...this.errorObjInit };
    this.loadingPlanning = true;
    this.isFullFeedPlanning = false;
    this.planningService.getPlanning(serverIp, dateStart, dateEnd).subscribe({
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
        console.log(error);
        this.loadingPlanning = false;
        this.isFullFeedPlanning = false;
        this.errorObj.isError = true;
        this.errorObj.message = error?.error?.message || error;
      }
    });
  }

  selectHotel(event: MatSelectChange) {
    this.serverIp = event.value;
    console.log(this.dateEnd);
    this.getPlanning(this.serverIp, this.dateStart, this.dateEnd);
  }
}
