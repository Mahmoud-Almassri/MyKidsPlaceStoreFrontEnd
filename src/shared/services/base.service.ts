import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actions, Controllers, httpFormDataOptions, httpOptions } from '../global-variables/api-config';
import { environment } from '../../environments/environment';
const apiPreLink = environment.apiPreLink;
@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(private http: HttpClient) {

  }

  public getAllItems(controllerName: string): Observable<any> {
    return this.http.get(apiPreLink + controllerName + Actions.GetAllItems);
  }
  public getAllItemsWithImages(controllerName: string, subCategoryId: number): Observable<any> {
    return this.http.get(apiPreLink + controllerName + Actions.GetAllItemsWithImages + '/' + subCategoryId);
  }
  public getItemsBySetId(controllerName: string, setId: number): Observable<any> {
    return this.http.get(apiPreLink + controllerName + Actions.GetItemsBySetId + '/' + setId);
  }
  public getSubCategoryUsers(controllerName: string, subCategoryId: number): Observable<any> {
    return this.http.get(apiPreLink + controllerName + Actions.GetSubCategoryUsers + '/' + subCategoryId);
  }

  public getList(controllerName: string, baseSearch): Observable<any> {
    return this.http.post(apiPreLink + controllerName + Actions.GetList, JSON.stringify(baseSearch), httpOptions);
  }
  public getFilteredItems(controllerName: string, baseSearch): Observable<any> {
    return this.http.post(apiPreLink + controllerName + Actions.GetFilteredItems, JSON.stringify(baseSearch), httpOptions);
  }

  public getById(controllerName: string, id: number): Observable<any> {
    return this.http.get(apiPreLink + controllerName + Actions.GetById + '/' + id);
  }
  public getNews(controllerName: string): Observable<any> {
    return this.http.get(apiPreLink + controllerName + Actions.Get);
  }
  public getByIdWithRelated(controllerName: string, id: number): Observable<any> {
    return this.http.get(apiPreLink + controllerName + Actions.GetItemByIdWithRelated + '/' + id);
  }
  public getByParentId(controllerName: string, parentId: number): Observable<any> {
    return this.http.get(apiPreLink + controllerName + Actions.GetByParentId + '/' + parentId);
  }

  public postItem(controllerName: string, actionName: string, postObject: any): Observable<any> {
    return this.http.post(apiPreLink + controllerName + actionName, JSON.stringify(postObject), httpOptions);
  }
  public postItemImages(controllerName: string, actionName: string, itemId: number, itemImages: FormData): Observable<any> {

    return this.http.post(apiPreLink + controllerName + actionName + '/' + itemId, itemImages, { responseType: 'text' });
  }

  public PostRange(controllerName: string, actionName: string, postObject: any): Observable<any> {
    return this.http.post(apiPreLink + controllerName + actionName, JSON.stringify(postObject), httpOptions);
  }

  public editItem(controllerName: string, editObject: any): Observable<any> {
    return this.http.post(apiPreLink + controllerName + Actions.EditItem, JSON.stringify(editObject), httpOptions);
  }
  public deleteSetItem(itemId: number): Observable<any> {
    return this.http.get(apiPreLink + Controllers.Item + Actions.DeleteSetItem + '/' + itemId, httpOptions);
  }
  public updateStatus(controllerName: string, id: number): Observable<any> {
    return this.http.post(apiPreLink + controllerName + Actions.UpdateStatus, id, httpOptions);
  }

  public editRange(controllerName: string, editObject: any): Observable<any> {
    return this.http.put(apiPreLink + controllerName + Actions.EditRange, JSON.stringify(editObject), httpOptions);
  }

  public removeItemById(controllerName: string, id: number): Observable<any> {
    return this.http.get(apiPreLink + controllerName + Actions.RemoveItemById + '/' + id);
  }

  public removeItem(controllerName: string, id: number): Observable<any> {
    return this.http.get(apiPreLink + controllerName + Actions.RemoveItem + '/' + id);
  }
  public removeItemImage(controllerName: string, id: number): Observable<any> {
    return this.http.get(apiPreLink + controllerName + Actions.RemoveItemImage + '/' + id);
  }

  public removeRange(controllerName: string, postobject: any): Observable<any> {
    return this.http.post(apiPreLink + controllerName + Actions.RemoveRange, JSON.stringify(postobject), httpOptions);
  }

  public toggleAllItems(from, to): Observable<any> {
    return this.http.get(apiPreLink + 'Item/ToggleAllProducts/' + from + '/' + to);
  }

  public toggleSaleStatus(id): Observable<any> {
    return this.http.get(apiPreLink + 'Sale/ToggleStatus/' + id);
  }
}
