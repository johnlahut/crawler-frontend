import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {AgGridModule} from 'ag-grid-angular';
import {FormsModule} from '@angular/forms';

import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatSidenavModule,
  MatExpansionModule,
  MatCardModule,
  MatDividerModule,
  MatButtonToggleModule,
  MatMenuModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';

import {AddFilterDialogComponent} from './home/add-filter.component';
import {HomeComponent} from './home/home.component';



const appRoutes: Routes = [
  {path: '', component: HomeComponent, data: {title: 'Home'}},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddFilterDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatCardModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,

    AgGridModule,

    RouterModule.forRoot(
      appRoutes,
      {useHash: true}
    )
  ],
  providers: [],
  entryComponents: [AddFilterDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
