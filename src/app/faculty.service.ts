import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { unsupported } from '@angular/compiler/src/render3/view/util';

@Injectable({
  providedIn: 'root'
})
export class FacultyService {

  facultyData: any[];
  searchText = new Subject<string>();
  constructor(private http: HttpClient) {

  }

  sortName(unSortedData, sortType, sortField) {
    const data = [...unSortedData];
    data.sort((a, b) => {
      const nameA = a[sortField].toLowerCase();
      const nameB = b[sortField].toLowerCase();
      if ( sortType === '1' ) {
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
      } else if ( sortType === '-1' ) {
        if (nameA > nameB) {
          return -1;
        }
        if (nameA < nameB) {
          return 1;
        }
        return 0;
      }
    });

    return data;
  }

  sortAscending(data, sortField, sortMethod) {
    let unSortedData = [...data];
    if ( sortField !== 'emp_name' && sortField !== 'joined_date') {
      unSortedData.sort((a, b) => {
        return a[sortField] - b[sortField];
      });
    } else if (sortField === 'emp_name') {
      unSortedData = this.sortName(unSortedData, sortMethod, sortField);
    } else if (sortField === 'joined_date') {
      unSortedData.sort((a, b) => {
        let dateA = new Date(a[sortField]).getTime();
        let dateB = new Date(b[sortField]).getTime();
        return dateA - dateB; // sort by date ascending
    });
    }

    return unSortedData;
  }

  sortDecending(data, sortField, sortMethod) {
    let unSortedData = [...data];
    if ( sortField !== 'emp_name' && sortField !== 'joined_date') {
      unSortedData.sort((a, b) => {
        return b[sortField] - a[sortField];
      });
    } else if (sortField === 'emp_name') {
      unSortedData = this.sortName(unSortedData, sortMethod, sortField);
    } else if (sortField === 'joined_date') {
      unSortedData.sort((a, b) => {
        let dateA = new Date(a[sortField]).getTime();
        let dateB = new Date(b[sortField]).getTime();
        return dateB - dateA; // sort by date ascending
    });
    }

    return unSortedData;
  }

  filterWithAge(item, ageFilter,field) {
    if ( ageFilter.hasOwnProperty('parameters') && ageFilter.parameters != null && ageFilter.parameters != '') {
      if ( (ageFilter.method === 'equality' && item[field] === ageFilter.parameters) || 
           (ageFilter.method === 'range' && item[field] >= ageFilter.parameters[0] && item[field] <= ageFilter.parameters[1])) {
         return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  filterWithDate(item, ageFilter,field) {
    if ( ageFilter.hasOwnProperty('parameters') && ageFilter.parameters[0] != '' && ageFilter.parameters[1] != '') {
      if ( (ageFilter.method === 'equality' && item[field] === ageFilter.parameters) || 
           (ageFilter.method === 'range' && new Date(item[field]) >= new Date(ageFilter.parameters[0]) && new Date(item[field]) <= new Date(ageFilter.parameters[1]))) {
         return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  filterWithSubject(item, ageFilter,field) {
    if ( ageFilter.hasOwnProperty('parameters') && ageFilter.parameters != "") {
      if ( (ageFilter.method === 'equality')) {
        if ( field === 'rating' ) {
          if(ageFilter.parameters.includes(item[field])) {
            return true;
          }  
        }else{
          for(let y=0; y < item[field].length;y++){
            if(ageFilter.parameters.includes(item[field][y])) {
              return true;
            }
          }
        }
        return false;
      } else {
        return false;
      }
    } else {
      return true;
    }  
  }

  searchData(result, search, filter) {
    const result1 = [];
    const filterCondition = JSON.parse(filter);
    let ageFilter = {};
    let salaryFilter = {};
    let subjectsFilter = {};
    let dateFilter = {};
    let ratingFilter = {};

    for (let x = 0; x < filterCondition.length; x++ ){
      if( filterCondition[x].field === 'age'){
        ageFilter = { method : filterCondition[x].method, parameters : filterCondition[x].parameters  };
      }

      if( filterCondition[x].field === 'salary') {
        salaryFilter = { method : filterCondition[x].method, parameters : filterCondition[x].parameters  };
      }

      if( filterCondition[x].field === 'joined_date') {
        dateFilter = { method : filterCondition[x].method, parameters : filterCondition[x].parameters  };
      }

      if(filterCondition[x].field === 'subjects') {
        subjectsFilter = { method : filterCondition[x].method, parameters : filterCondition[x].parameters  };
      }

      if(filterCondition[x].field === 'rating') {
        ratingFilter = { method : filterCondition[x].method, parameters : filterCondition[x].parameters  };
      }


    }

    if (search === '' && filterCondition.length == 0) {
      return result;
    } else {
      for (let x = 0; x < result.length; x++) {
        if ((result[x].emp_name.toLocaleLowerCase().includes(search) ||
        (result[x].salary.toString()).includes(search) ||
        (result[x].rating.toString()).includes(search) ||
        result[x].joined_date.includes(search)) && 
        (this.filterWithAge(result[x],ageFilter,'age') && 
        this.filterWithAge(result[x],salaryFilter,'salary') &&
        this.filterWithSubject(result[x],subjectsFilter,'subjects') &&
        this.filterWithSubject(result[x],ratingFilter,'rating') &&
        this.filterWithDate(result[x],dateFilter,'joined_date') )) {
          result1.push(result[x]);        }
      }
      return result1;
    }
  }

  sortData(result, sort) {
    if ( sort !== '' ) {
      let unSortedData = [...result];
      const sortCondition = JSON.parse(sort);
      const sortMethod = sortCondition[0].method;
      
      const sortField = sortCondition[0].field;
      switch (sortMethod) {
        case '1':
            unSortedData = this.sortAscending(unSortedData, sortField, sortMethod);
            break;
        case '-1':
            unSortedData = this.sortDecending(unSortedData, sortField, sortMethod);
            break;

        case '0':
            unSortedData = unSortedData
            break;
      }
      return unSortedData;
    } else {
      return result;
    }

  }

  filterResults(qstr) {
    const queryStr = qstr;
    const result = [...this.facultyData];
    const search = this.getParameterByName('search', queryStr).toLocaleLowerCase();
    const sort = this.getParameterByName('sort', queryStr);
    const filter = this.getParameterByName('filter',queryStr);
    const searchResult = this.searchData(result, search,filter);
    const sortResult = this.sortData(searchResult, sort);

    return sortResult;
  }

  saveEditedData(unsavedDetails,qstr) {
    const unsavedId = unsavedDetails[0].emp_id;

    for(let x = 0; x < this.facultyData.length; x++){
      if (this.facultyData[x].emp_id === unsavedId) {
        this.facultyData[x] = unsavedDetails[0];
        break;
      }
    }
    this.facultyData.forEach((item,index) => {
      
    });
    return this.filterResults(qstr);
  }

  getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) { return null; }
    if (!results[2]) { return ''; }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  getFacultData() {
    return this.http.get('assets/faculty-data.json').toPromise();
  }

  postData(search): void {
    this.searchText.next(search);
  }

  getData(): Observable < any > {
    return this.searchText.asObservable();
  }

}
