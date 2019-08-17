import {Component, Inject, OnInit} from '@angular/core';
import {Contact, Url, UrlService} from '../services/url.service';
import {ContactFactory, UrlFactory} from '../factories/factories';
import {Globals} from '../app.config';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {AddFilterDialogComponent} from './add-filter.component';
import {MatDialog} from '@angular/material';
import {interval} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';
import * as uuid from 'uuid';

export interface DialogData {
  name: string;
  url: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // maps all URLs to PKs
  private masterList = {};

  // look up grid APIs
  private gridMap = {};

  // current grid data
  notStartedData = [];
  inProgressData = [];
  completedData = [];
  warningData = [];
  errorData = [];

  // current filters
  currLookForFilter = [];
  currContentTypeFilter = [];
  currExcludeTypeFilter = [];

  focusedUrl: Url;
  globals = Globals;
  hideID = true;

  // log export
  logUrl;
  logFilename;

  // add filter options
  filterName: string;
  filterURL: string;

  notStartedColumnDef = [
    {headerName: 'Not Started', field: 'url'},
    {headerName: 'ID', field: 'id', hide: this.hideID},
  ];

  inProgressColumnDef = [
    {headerName: 'In Progress', field: 'url'},
    {headerName: 'ID', field: 'id', hide: this.hideID},
  ];

  completedColumnDef = [
    {headerName: 'Completed', field: 'url'},
    {headerName: 'ID', field: 'id', hide: this.hideID},
  ];

  warningColumnDef = [
    {headerName: 'Warning', field: 'url'},
    {headerName: 'ID', field: 'id', hide: this.hideID},
  ];

  errorColumnDef = [
    {headerName: 'Error', field: 'url'},
    {headerName: 'ID', field: 'id', hide: this.hideID},
  ];

  gridOptions = {
    // rowHeight: 35,
  };


  constructor(
    private sanitizer: DomSanitizer,
    private addFilterDialog: MatDialog,
    private urlService: UrlService,
    private router: Router
  ) {

    let url: Url;

    let sample = [
      'http://www.thefoodpantries.org',
      'http://schenectadycounty.com/dss',
      'cdcccc.org/',
      'grassrootgivers.org',
    ];

    for (let i = 0; i < 4; i++) {

      const contact: Contact = ContactFactory.create();
      url = UrlFactory.create({
        contact
      });
      url.id = uuid.v4();
      url.url = sample[i];
      switch (url.status) {
        case('in_progress'): {
          this.inProgressData.push({url: url.url, id: url.id});
          break;
        }
        case('not_started'): {
          this.notStartedData.push({url: url.url, id: url.id});
          break;
        }
        case('completed'): {
          this.completedData.push({url: url.url, id: url.id});
          break;
        }
        case('warning'): {
          this.warningData.push({url: url.url, id: url.id});
          break;
        }
        case('error'): {
          this.errorData.push({url: url.url, id: url.id});
          break;
        }
      }
      this.masterList[url.id] = url;
    }
    this.focusedUrl = url;
  }

  onGridReady(params, id) {
    switch (id) {
      case(this.globals.NOT_STARTED_STATUS): {
        this.gridMap[this.globals.NOT_STARTED_STATUS] = params.api;
        break;
      }

      case(this.globals.IN_PROGRESS_STATUS): {
        this.gridMap[this.globals.IN_PROGRESS_STATUS] = params.api;
        break;
      }

      case(this.globals.WARNING_STATUS): {
        this.gridMap[this.globals.WARNING_STATUS] = params.api;
        break;
      }

      case(this.globals.ERROR_STATUS): {
        this.gridMap[this.globals.ERROR_STATUS] = params.api;
        break;
      }

      case (this.globals.COMPLETE_STATUS): {
        this.gridMap[this.globals.COMPLETE_STATUS] = params.api;
        break;
      }
    }
  }

  onCellClicked(params, id) {

    for (const k in this.gridMap) {
      if (k === id) {
        const cell = params.api.getSelectedRows().pop();
        this.focusedUrl = this.masterList[cell.id];
        this.currLookForFilter = this.masterList[cell.id].lookForFilter;
        this.currContentTypeFilter = this.masterList[cell.id].contentTypeFilter;
        this.currExcludeTypeFilter = this.masterList[cell.id].excludeFilter;
      } else {
        this.gridMap[k].deselectAll();
      }
    }
  }

  onSelectionChanged(params, id) {}

  // called when update settings button is pressed
  updateSettings(id) {
    console.log('>> Calling update settings ', id);
    const lookForButtons = document.querySelectorAll('.' + this.globals.lookForButtonClass);
    const contentButtons = document.querySelectorAll('.' + this.globals.contentTypeButtonClass);
    const excludeButtons = document.querySelectorAll('.' + this.globals.excludeButtonClass);

    const url: Url = this.masterList[id];
    const lookForFilter: string[] = [];
    const contentFilter: string[] = [];
    const excludeFilter: string[] = [];

    // loop through look for filters, set selected ones on element

    // @ts-ignore
    for (const element of lookForButtons) {
      const filter: string = element.textContent.toLowerCase();

      if (element.classList.contains('mat-button-toggle-checked')) {
        lookForFilter.push(filter);
      }
    }
    // @ts-ignore
    for (const element of contentButtons) {
      const filter: string = element.textContent.toLowerCase();
      if (element.classList.contains('mat-button-toggle-checked')) {
        contentFilter.push(filter);
      }
    }
    // @ts-ignore
    for (const element of excludeButtons) {
      const filter: string = element.textContent.toLowerCase();
      if (element.classList.contains('mat-button-toggle-checked')) {
        excludeFilter.push(filter);
      }
    }

    url.lookForFilter = lookForFilter;
    url.contentTypeFilter = contentFilter;
    url.excludeFilter = excludeFilter;
  }

  // called when removing a URL from the in_progress queue and putting it back into the not_started queue
  cancelURL(id, status) {
    console.log('>> Calling cancel URL: ', id, status);
    const cell = this.gridMap[status].getFocusedCell();

    switch (status) {
      case (this.globals.IN_PROGRESS_STATUS): {
        this.masterList[id].status = this.globals.NOT_STARTED_STATUS;
        this.notStartedData.push(this.inProgressData[cell.rowIndex]);
        this.inProgressData.splice(cell.rowIndex, 1);

        this.gridMap[this.globals.NOT_STARTED_STATUS].setRowData(this.notStartedData);
        this.gridMap[this.globals.IN_PROGRESS_STATUS].setRowData(this.inProgressData);
      }
    }
  }

  // called when removing a URL from the current queue is needed
  removeURL(id, status) {
    console.log('>> Calling remove URL: ', id, status);
    const cell = this.gridMap[status].getFocusedCell();
    switch (status) {
      case (this.globals.NOT_STARTED_STATUS): {
        this.notStartedData.splice(cell.rowIndex, 1);
        this.gridMap[status].setRowData(this.notStartedData);
        break;
      }
      case (this.globals.IN_PROGRESS_STATUS): {
        this.inProgressData.splice(cell.rowIndex, 1);
        this.gridMap[status].setRowData(this.inProgressData);
        break;
      }
      case (this.globals.COMPLETE_STATUS): {
        this.completedData.splice(cell.rowIndex, 1);
        this.gridMap[status].setRowData(this.completedData);
        break;
      }
      case (this.globals.WARNING_STATUS): {
        this.warningData.splice(cell.rowIndex, 1);
        this.gridMap[status].setRowData(this.warningData);
        break;
      }
      case (this.globals.ERROR_STATUS): {
        this.errorData.splice(cell.rowIndex, 1);
        this.gridMap[status].setRowData(this.errorData);
        break;
      }
    }
  }

  // called when URL is in complete queue and user selects to review the crawled content
  reviewURL(id, status) {
    console.log('>> Calling review URL: ', id, status);
  }

  // called when URL in error or warning queue and user selects to ignore the warnings
  ignoreURL(id, status) {
    console.log('>> Calling ignore URL: ', id, status);
    const cell = this.gridMap[status].getFocusedCell();
    switch (status) {
      case (this.globals.WARNING_STATUS): {
        this.masterList[id].status = this.globals.COMPLETE_STATUS;
        this.completedData.push(this.warningData[cell.rowIndex]);
        this.warningData.splice(cell.rowIndex, 1);
        this.gridMap[this.globals.WARNING_STATUS].setRowData(this.warningData);
        break;
      }
      case (this.globals.ERROR_STATUS): {
        this.masterList[id].status = this.globals.COMPLETE_STATUS;
        this.completedData.push(this.errorData[cell.rowIndex]);
        this.errorData.splice(cell.rowIndex, 1);
        this.gridMap[this.globals.ERROR_STATUS].setRowData(this.errorData);
        break;
      }
    }
    this.gridMap[this.globals.COMPLETE_STATUS].setRowData(this.completedData);
  }

  // called when user selects 'Download Logs' from the dropdown on URL details
  downloadLogs(url: Url) {
    console.log('>> Calling download logs: ', url.id);
    this.logFilename = `${url.url}_${url.id}_data.txt`;
    this.urlService.getCrawledData([url.id]).subscribe(
      response => {
        console.log('success fetching crawled data', response);
        const content = response[0]['crawled_data'];
        const blob: Blob = new Blob([content], {type: 'text/plain'});
        this.logUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      },
      (error) => {
        console.log('error getting crawled data', error);
      }
    );
  }

  // called when users selects 'Load Defaults' from one of the filtering dropdown menus
  loadDefault(id, filter) {
    console.log('>> Calling load default filters: ', filter);
    const url: Url = this.masterList[id];
    switch (filter) {
      case (this.globals.LOOK_FOR_FILTER): {
        url.lookForFilter = this.globals.lookForFilterDefaults;
        break;
      }
      case (this.globals.CONTENT_FILTER): {
        url.contentTypeFilter = this.globals.contentTypeFilterDefaults;
        break;
      }
      case (this.globals.EXCLUDE_FILTER): {
        url.excludeFilter = this.globals.excludeFilterDefaults;
        break;
      }
    }
  }

  // called when user wants to add a new filter
  openDialog(filter) {
    console.log('>> Calling add filter dialog', filter);
    const dialogRef = this.addFilterDialog.open(AddFilterDialogComponent, {
      data: {name: this.filterName, url: this.filterURL, filter}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('closing dialog', result, filter);

      switch (filter) {
        case (this.globals.LOOK_FOR_FILTER): {
          this.focusedUrl.lookForFilter.push('placeholder');
          console.log(this.focusedUrl);
          break;
        }
        case (this.globals.CONTENT_FILTER): {
          this.focusedUrl.contentTypeFilter.push('placeholder');
          break;
        }
        case (this.globals.EXCLUDE_FILTER): {
          this.focusedUrl.excludeFilter.push('placeholder');
          break;
        }
      }
    });
  }

  onStart(): void {

    console.log(this.notStartedData);

    for (const i of this.notStartedData) {
      this.urlService.startJob(this.masterList[i.id]).subscribe(
        response => {
          console.log('success', response);
        },
        (error) => {
          console.error('error', error);
        });
    }
    console.log(Object.keys(this.masterList));
  }

  fileUpload() {
    console.log('file upload');
  }

  private getQueue(status) {

    if (status === this.globals.NOT_STARTED_STATUS)
      return this.notStartedData;
    else if (status === this.globals.IN_PROGRESS_STATUS)
      return this.inProgressData;
    else if (status === this.globals.COMPLETE_STATUS)
      return this.completedData;
    else if (status === this.globals.WARNING_STATUS)
      return this.warningData;
    else if (status === this.globals.ERROR_STATUS)
      return this.errorData;

  }

  // removes element from appropriate queue
  private delFromQueue(row, status) {

    let queue = this.getQueue(status);

    for (let i in queue) {
      if (queue[i].id === row.id) {
        queue.splice(parseInt(i), 1);
      }
    }
  }

  // adds element to appropriate queue
  private addToQueue(row, status) {

    let queue = this.getQueue(status);
    queue.push(row);
  }

  // reloads data into queues
  private refreshQueues() {

    this.gridMap[this.globals.NOT_STARTED_STATUS].setRowData(this.notStartedData);
    this.gridMap[this.globals.IN_PROGRESS_STATUS].setRowData(this.inProgressData);
    this.gridMap[this.globals.COMPLETE_STATUS].setRowData(this.completedData);
    this.gridMap[this.globals.WARNING_STATUS].setRowData(this.warningData);
    this.gridMap[this.globals.ERROR_STATUS].setRowData(this.errorData);
  }

  // processes polling api call
  private processUpdate(response) {
    let change = false;

    for (const job of response) {

      // get local url, create new data row
      const url: Url = this.masterList[job.client_id];
      const row = {url: url.url, id: job.client_id};

      // if there is a status conflict, update the queue
      if (job.status != url.status) {
        this.delFromQueue(row, url.status);
        this.addToQueue(row, job.status);
        change = true;
        url.status = job.status;
        this.masterList[job.client_id] = url;
      }
    }

    // if there was a queue change, update the queues
    if (change) {
      this.refreshQueues();
    }
  }

  ngOnInit() {
    interval(5000).pipe(
      startWith(6000),
      switchMap(() => this.urlService.updateStatus(Object.keys(this.masterList)))
    ).subscribe(
      response => this.processUpdate(response)
    );
  }
}
