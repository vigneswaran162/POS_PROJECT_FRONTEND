import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class OrdermasterService {

  private APIUrl: string;
  private APIUrl1: string;
  constructor(private http: HttpClient) { }

  async GetItemAll() {
    this.APIUrl = 'https://posbackend-psi.vercel.app/api/GetItem';
    let res = await this.http.get(this.APIUrl).toPromise()
    return res
  }

  async GetOrderAll() {
    this.APIUrl = 'https://posbackend-psi.vercel.app/api/GetOrderAll';
    let res = await this.http.get(this.APIUrl).toPromise()
    return res
  }

  async GetOrderTypeCount() {
    this.APIUrl = 'https://posbackend-psi.vercel.app/api/GetOrderTypeCount';
    let res = await this.http.get(this.APIUrl).toPromise()
    return res
  }


  async OrderStatusupdate(_id: string, OrderStatus: string) {
    this.APIUrl = 'https://posbackend-psi.vercel.app/api/OrderStatusupdate?_id=' + _id + '&OrderStatus=' + OrderStatus;
    let res = await this.http.get(this.APIUrl).toPromise()
    return res
  }


   async SalesReport(FromDate:any, ToDate:any) {
    this.APIUrl = 'https://posbackend-psi.vercel.app/api/SalesReport?FromDate=' + FromDate + '&ToDate=' + ToDate;
    let res = await this.http.get(this.APIUrl).toPromise()
    return res
  }

   async updatetablestatus(TableStatus:any, TableNo:any) {
    this.APIUrl = 'https://posbackend-psi.vercel.app/api/update-table-status?TableStatus=' + TableStatus + '&TableNo=' + TableNo;
    let res = await this.http.get(this.APIUrl).toPromise()
    return res
  }

  async CRUD(entity: any): Promise<any> {
    if (entity.OpsType == "S") {
      this.APIUrl = 'https://posbackend-psi.vercel.app/api/OrderCreate';
    }
    else if (entity.OpsType == "U") {
      this.APIUrl = 'https://posbackend-psi.vercel.app/api/OrderUpdate';
    }
    else if (entity.OpsType == "V") {
      this.APIUrl = 'https://posbackend-psi.vercel.app/api/OrderDelete';
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
