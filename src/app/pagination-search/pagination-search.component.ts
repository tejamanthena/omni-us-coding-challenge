import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FacultyService } from '../faculty.service';
import * as settings from '../app-config.js';

@Component({
  selector: 'app-pagination-search',
  templateUrl: './pagination-search.component.html',
  styleUrls: ['./pagination-search.component.scss']
})
export class PaginationSearchComponent implements OnInit {

  searchPageObj = { search: '', pages: '10' };
  searchPaginationForm: FormGroup;
  dataPerPage = settings.appConfig.pagination.listOfPages;
  noPages = settings.appConfig.pagination.defaultNoofPages;
  includeSearch = settings.appConfig.includeSearch;
  constructor(private fb: FormBuilder, private facultyService: FacultyService) { }

  ngOnInit() {
    this.searchPaginationForm = this.fb.group({
      search: [''],
      pages: [this.noPages]
    });

    this.searchPaginationForm.get('search').valueChanges.pipe(debounceTime(600), distinctUntilChanged())
      .subscribe(newValue => {
        this.searchPageObj.search = newValue;
        this.facultyService.postData(this.searchPageObj);
      });

    this.searchPaginationForm.get('pages').valueChanges.pipe(distinctUntilChanged())
      .subscribe(newValue => {
        this.searchPageObj.pages = newValue;
        this.facultyService.postData(this.searchPageObj);
      });
  }
}
