import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrdermasterService } from '../../Services/ordermaster.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [FormsModule, CommonModule, NgFor],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  OrderDetails: any;
  OrderType: string = '';
  isLoading: boolean;
  isPopupOpen: boolean = false;
  OrderDetailDet: any;
  FillterOrderDetails: any[] = [];

  constructor(private OrderService: OrdermasterService) { }

  async ngOnInit() {
    this.OrderDetails = [];
    this.OrderDetailDet = [];
    await this.GetOrderAll();
    this.OrderType = 'All'
  }

  onItemTypeChange(event: any) {
    if (this.OrderType.toLocaleLowerCase() == 'all') {
      this.FillterOrderDetails = this.OrderDetails;
    } else if (this.OrderType.toLocaleLowerCase() == 'pending') {
      this.FillterOrderDetails = this.OrderDetails.filter((i: any) => i.OrderStatus.toLocaleLowerCase() == this.OrderType.toLocaleLowerCase());
    } else if (this.OrderType.toLocaleLowerCase() == 'preparing') {
      this.FillterOrderDetails = this.OrderDetails.filter((i: any) => i.OrderStatus.toLocaleLowerCase() == this.OrderType.toLocaleLowerCase());
    } else if (this.OrderType.toLocaleLowerCase() == 'ready') {
      this.FillterOrderDetails = this.OrderDetails.filter((i: any) => i.OrderStatus.toLocaleLowerCase() == this.OrderType.toLocaleLowerCase());
    }else if (this.OrderType.toLocaleLowerCase() == 'cancel') {
      this.FillterOrderDetails = this.OrderDetails.filter((i: any) => i.OrderStatus.toLocaleLowerCase() == this.OrderType.toLocaleLowerCase());
    }

  }


  async GetOrderAll() {
    this.isLoading = true
    let response: any = await this.OrderService.GetOrderAll().catch(err => {
      alert(err.message)
      this.isLoading = false
    })
    if (response != undefined) {
      this.OrderDetails = response.sort((a: any, b: any) => new Date(b.OrderDate).getTime() - new Date(a.OrderDate).getTime());;
      this.FillterOrderDetails = this.OrderDetails;
      this.isLoading = false

    } else {
      this.isLoading = false
      alert(response.error)
    }
  }


  closePopup() {
    this.isPopupOpen = false;
  }


  OnClickDetails(item: any) {
    this.isPopupOpen = true;
    this.OrderDetailDet = item;
  }

  async OnSubmit(item: any, type: string) {
    this.isLoading = true
    let response: any = await this.OrderService.OrderStatusupdate(item._id,type).catch(err => {
      alert(err.message)
      this.isLoading = false
    })
    if (response != undefined) {
      await this.GetOrderAll()
    } else {
      this.isLoading = false
      alert(response.error)
    }
  }
}
