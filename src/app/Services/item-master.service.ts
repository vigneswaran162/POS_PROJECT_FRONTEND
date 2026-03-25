import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ItemMasterService {


  private APIUrl: string;
  constructor(private http:HttpClient) { }


  async GetItemAll() {
    this.APIUrl = 'https://pos-project-backend-tf38.onrender.com/api/GetItem';
    let res = await this.http.get(this.APIUrl).toPromise()
    return res
  }

    async GetTablesAll() {
    this.APIUrl = 'https://pos-project-backend-tf38.onrender.com/api/GetTables';
    let res = await this.http.get(this.APIUrl).toPromise()
    return res
  }


  getSalesReport(filter: any) {
  return this.http.get<any>('https://pos-project-backend-tf38.onrender.com/api/SalesReport', {
    params: filter
  });
}

  async CRUD(entity:any): Promise<any> {
  if (entity.OpsType == "S") {
    this.APIUrl = 'https://pos-project-backend-tf38.onrender.com/api/Itemcreate';
  }
  else if (entity.OpsType == "U") {
    this.APIUrl = 'https://pos-project-backend-tf38.onrender.com/api/AddEvents/Update';
  }
  else if (entity.OpsType == "V") {
    this.APIUrl = 'https://pos-project-backend-tf38.onrender.com/api/AddEvents/Delete';
  }
  let headers = new HttpHeaders({
    'content-Type': 'application/json',
    Accept: 'application/json',
  });
  let options = {
    headers: headers,
  };
  let res = await this.http.post(this.APIUrl, entity, options).toPromise()
  return res;
  }


}
