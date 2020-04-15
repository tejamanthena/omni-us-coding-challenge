import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule  } from '@angular/forms';

import { AppComponent } from './app.component';
import { PaginationSearchComponent } from './pagination-search/pagination-search.component';

@NgModule({
  declarations: [
    AppComponent,
    PaginationSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
