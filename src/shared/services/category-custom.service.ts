import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const apiPreLink = environment.apiPreLink;
@Injectable({
  providedIn: 'root'
})
export class CategoryCustomService {
  /**
   *
   */
  constructor(private httpClient: HttpClient) {
  }

  postCategoryWithFile(category, file): Observable<any>{
    const formData = new FormData();
    formData.append('categoryName', category.categoryName);
    formData.append('categoryNameAr', category.categoryNameAr);
    formData.append('status', category.status);
    formData.append('file', file);
    return this.httpClient.post(apiPreLink + 'Category/Create', formData);
  }

  updateCategoryWithFile(category, file): Observable<any>{
    const formData = new FormData();
    formData.append('Id', category.id);
    formData.append('categoryName', category.categoryName);
    formData.append('categoryNameAr', category.categoryNameAr);
    formData.append('status', category.status);
    formData.append('file', file);
    return this.httpClient.post(apiPreLink + 'Category/Update', formData);
  }
}
