import { Component, OnInit } from '@angular/core';
import { FacultyService } from './faculty.service';
import * as settings from './app-config.js';
import { Filter } from '../app/shared/filter.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'faculty';
  sort = { field: '', method: '0' };
  filter = [];
  currentEditableEmployee = 0;
  facultyData: any[];
  currentPage = 1;
  totalRecords = 0;
  totalPages = 0;
  searchString = '';
  sortMethodName = '0';
  currentFilter = '';
  recordPerPage = settings.appConfig.pagination.defaultNoofPages;
  contentWidth = settings.appConfig.data_table_width;
  enableEditing = settings.appConfig.enableEditing;
  fieldsToInclude = settings.appConfig.fields_to_include;
  enableSorting = settings.appConfig.sort.enableSorting;
  fieldsToIncludeInSorting = settings.appConfig.sort.sortableFields;
  paginatedData = [];
  cursor = 'emp_id';
  queryString = '';
  currentSubjects = [];
  ratingList = [5, 6, 7, 8, 9, 10];
  subjectFilterArr = [];
  ratingFilterArr = [];
  subjects = ['Economics', 'Biology', 'Engineering', 'Physics', 'Social', 'Science', 'Psychology'];
  startAge = '';
  endAge = '';
  startSalary = '';
  endSalary = '';
  startDate = '';
  endDate = '';
  errMsg = '';
  subArrStr = '';
  ratingArrStr = '';


  constructor(private facultyService: FacultyService) { }

  ngOnInit() {
    this.dataRetrival();
    this.facultyService.getData().subscribe((val) => {
      this.searchString = val.search;
      this.recordPerPage = parseInt(val.pages);
      this.generateQueryString();
      this.facultyData = this.facultyService.filterResults(this.queryString);
      this.currentPage = 1;
      this.calPagination();
    });
  }

  filterSubjectRating(event,sub,field){
    if ( field === 'subjects' ) {
      if (event.target.checked) {
        this.subjectFilterArr.push(sub)
      } else {
        let index = this.subjectFilterArr.indexOf(sub);
        this.subjectFilterArr.splice(index,1);
      }
      this.subArrStr = this.subjectFilterArr.join('');
    }

    if ( field === 'rating' ) {
      if (event.target.checked) {
        this.ratingFilterArr.push(sub)
      } else {
        let index = this.ratingFilterArr.indexOf(sub);
        this.ratingFilterArr.splice(index,1);
      }
      this.ratingArrStr = this.ratingFilterArr.join('');
    }
  }

  applyFilter(field, startValue, endValue) {
       this.applyFilterToAge(field,startValue,endValue);

  }

  checkIfFieldExistsInFilter(field: string) {
    for(let x = 0; x < this.filter.length;x++){
      if(this.filter[x].field === field){
        this.filter.splice(x,1);
      }
    }
  }

  arrangeParams(field,method,start,end){
    let parameters: string | number[] = '';
    if( field != 'joined_date' ){
      if ( !(start > end) ) {
        parameters = start;
        if ( start !== end ) {
          method = 'range';
          parameters = [ parseInt(start), parseInt(end) ];
        }
        this.filter.push(new Filter(field, method, parameters));
        this.errMsg = '';
        this.currentFilter = '';
      } else {
        this.errMsg = 'From value should be less than to value';
      }
    } else{
      if ( !(new Date(start) > new Date(end)) ) {
        parameters = start;
        if ( new Date(start) !== new Date(end) ) {
          method = 'range';
          parameters = [ start, end ];
        }
        this.filter.push(new Filter(field, method, parameters));
        this.errMsg = '';
        this.currentFilter = '';
      } else {
        this.errMsg = 'From value should be less than to value';
      }
    }
  }

  applyFilterToAge(field,start,end) {
    this.checkIfFieldExistsInFilter(field);
    let method = 'equality';
    this.arrangeParams(field,method,start,end);

    this.generateQueryString();
    this.facultyData = this.facultyService.filterResults(this.queryString);
    this.calPagination();
    this.errMsg = '';

  }

  generateQueryString() {
    this.queryString = `/api/endpoint?pageSize=${this.recordPerPage}&cursor=${this.cursor}&search=${this.searchString}&sort=${JSON.stringify([this.sort])}&filter=${JSON.stringify(this.filter)}`;
  }

  calPagination() {
    this.totalRecords = this.facultyData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.recordPerPage);

    const endIndex = (this.recordPerPage * this.currentPage);
    const startIndex = (this.recordPerPage * this.currentPage) - this.recordPerPage;

    this.paginatedData = this.facultyData.slice(startIndex, endIndex);
  }

  filterData(fieldName) {
    if (fieldName === this.currentFilter) {
      this.currentFilter = '';
    } else {
      this.currentFilter = fieldName;
    }
  }

  sortData(fieldName) {
    if (this.sort.field === fieldName) {
      if (this.sort.method === '0') {
        this.sort.method = '1';
      } else if (this.sort.method === '1') {
        this.sort.method = '-1';
      } else if (this.sort.method === '-1') {
        this.sort.method = '0';
      }
    }

    if (this.sort.field !== fieldName) {
      this.sort.field = fieldName;
      this.sort.method = '1';
    }

    this.generateQueryString();
    this.facultyData = this.facultyService.filterResults(this.queryString);
    this.currentPage = 1;
    this.calPagination();
  }

  async dataRetrival() {
    const facultyData = (await this.facultyService.getFacultData()) as any;
    const data = facultyData.faculty;
    this.facultyService.facultyData = [...data];
    this.generateQueryString();
    this.facultyData = this.facultyService.filterResults(this.queryString);
    this.currentPage = 1;
    this.calPagination();
  }

  incrementPage() {
    if (!(this.currentPage == this.totalPages)) {
      this.currentPage += 1;
      this.calPagination();
    }

  }

  decrementPage() {
    if (!(this.currentPage == 1)) {
      this.currentPage -= 1;
      this.calPagination();
    }
  }

  updatePageNumber() {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    this.calPagination();
  }

  saveEditedData() {
    if (this.currentEditableEmployee != 0) {
      const prevData = this.paginatedData.filter((item) => {
        return item.emp_id == this.currentEditableEmployee;
      });

      if (this.currentSubjects.length != 0) {
        prevData[0].subjects = [...this.currentSubjects];
      }
      this.facultyData = this.facultyService.saveEditedData(prevData, this.queryString);

      this.calPagination();
    }

  }

  editEmployeeDetails(empId, subjects) {
    this.saveEditedData();
    this.currentEditableEmployee = empId;
    this.currentSubjects = [...subjects];
  }

  removeSubject(event, subjectName) {
    if (event.target.checked) {
      this.currentSubjects.push(subjectName);
    } else {
      const index = this.currentSubjects.indexOf(subjectName);
      this.currentSubjects.splice(index, 1);
    }
  }

  saveEditedEmployee(event) {
    if (event && event.target.id !== 'edit-faculty' && !event.target.className.includes(this.currentEditableEmployee)) {
      this.saveEditedData();
      this.currentEditableEmployee = 0;
      this.currentSubjects = [];
    }
  }
}
