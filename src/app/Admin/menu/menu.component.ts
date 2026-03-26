import { Component, OnInit } from '@angular/core';
import { ItemMasterService } from '../../Services/item-master.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../Services/toast.service';
import { OrderMasterModel } from '../../Model/OrderMasterModel';
import { OrdermasterService } from '../../Services/ordermaster.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  isLoading: boolean = false;
  ItemDetails: any;
  ItemType: string = 'AllMenu';
  OrderDet: any[] = [];
  TotalAmount: any;
  model: OrderMasterModel;
  isPopupOpen = false;
  isPopupOpen1: boolean = false;
  TablesDetails: any;
  FillterTableNo: any = [];

  constructor(private service: ItemMasterService, private Toast: ToastService, private OrderService: OrdermasterService) { }

  async ngOnInit() {
    this.OrderDet = [];
    await this.GetProducts(this.ItemType);
    await this.GetTablesAll();
    this.model = new OrderMasterModel();

  }



  async GetProducts(ItemType: string) {
    this.isLoading = false
    let response: any = await this.service.GetItemAll().catch(err => {
      alert(err.message)
      this.isLoading = true
    })
    if (response != undefined) {
      if (ItemType == 'AllMenu') {
        this.ItemDetails = response;
      } else {
        this.ItemDetails = response.filter((i: any) =>
          i?.Category?.toLowerCase?.() === ItemType?.toLowerCase?.()
        );

      }

      this.ItemDetails.forEach((event: any) => {
        if (event.ItemImage) {
          if (!event.ItemImage.startsWith("data:image")) {
            event.ItemImage = `data:image/png;base64,${event.ItemImage}`;
          }
        }
      });
      this.isLoading = true

    } else {
      this.isLoading = true
      alert(response.error)
    }
  }

  onItemTypeChange(event: any) {
    this.GetProducts(this.ItemType)
  }


  AddItem(item: any) {

    let find = this.OrderDet.some((i: any) => i.ItemCode == item.ItemCode)
    if (find) {
      this.Toast.showalert('Item Already Exist')
      return
    }
    let obj = {
      ItemCode: item.ItemCode,
      ItemName: item.ItemName,
      UOM: item.UOM,
      Rate: item.Rate,
      Category: item.Category,
      SubCategory: item.SubCategory,
      ItemType: item.ItemType,
      ItemImage: item.ItemImage,
      Qty: 1,
      TotalAmount: 0,
    }
    this.OrderDet.push(obj);

    this.AllTotalAmount()


  }

  DeleteRow(i: number) {
    this.OrderDet.splice(i, 1);
    this.AllTotalAmount()
  }

  AllTotalAmount() {
    this.TotalAmount = this.OrderDet.reduce((acc: any, curr: any) => {
      acc += curr.Rate * curr.Qty
      return acc
    }, 0)

    this.TotalAmount = parseFloat(this.TotalAmount.toFixed(2));
  }

  AddPlus(item: any) {
    if (item.Qty >= 10) {
      this.Toast.showalert('Maximun Order 10 Qty')
      return
    }
    item.Qty += 1;
    this.AllTotalAmount();
  }

  AddMinus(item: any) {
    if (item.Qty <= 1) {
      this.Toast.showalert('Minimum Order 1 Qty')
      return
    }
    item.Qty -= 1;
    this.AllTotalAmount();
  }



  preparemodel() {
    const mod = new OrderMasterModel();
    mod.OrderNo = "";
    mod.OrderDate = new Date();
    mod.CustomerName = this.model.CustomerName;
    mod.PaymentType = this.model.PaymentType;
    mod.PaymentStatus = this.model.PaymentType == "" ? 'Paid' : 'Unpaid';
    mod.TotalAmount = this.TotalAmount;
    mod.OrderStatus = "Pending";
    mod.OrderType = this.model.OrderType;
    mod.DeliveryAddress = this.model.DeliveryAddress;
    mod.CustomerPhoneNo = this.model.CustomerPhoneNo;
    mod.TableNo = this.model.TableNo;
    mod.OrderDetails = [];
    for (let i = 0; i < this.OrderDet.length; i++) {
      let obj = {
        ItemCode: this.OrderDet[i].ItemCode,
        ItemName: this.OrderDet[i].ItemName,
        Qty: this.OrderDet[i].Qty,
        Rate: this.OrderDet[i].Rate,
        Amount: this.OrderDet[i].Rate * this.OrderDet[i].Qty,
        Discount: 0,
        TaxPercent: 0,
        TaxAmount: 0,
        TotalAmount: this.TotalAmount
      }
      mod.OrderDetails.push(obj)
    }



    mod.TaxAmount = 0;
    mod.Void = 'N';
    mod.OpsType = 'S'


    return mod
  }



  formvalidation(): boolean {
    if (this.OrderDet.length > 0) {
      this.Toast.show("Maximum one order can be allowed");
      return false;
    }
    if (!this.model.OrderType || this.model.OrderType.trim() === "") {
      this.Toast.show("Please Select Order Type");
      return false;
    }

    if (!this.model.PaymentType || this.model.PaymentType.trim() === "") {
      this.Toast.show("Please Select Payment Type");
      return false;
    }


    return true;
  }


  onSubmit() {
    if (this.formvalidation()) {
      const editmod = this.preparemodel()
      this.CRUD(editmod)
    }
  }

  async updatetablestatus(TableStatus: any, TableNo: any) {
    let response: any = await this.OrderService.updatetablestatus(TableStatus, TableNo).catch((err) => {
      alert(err.message)
    });
    if (response != undefined) {
      this.GetTablesAll()
    }
  }

  async CRUD(_model: OrderMasterModel) {
    let response: any = await this.OrderService.CRUD(_model).catch((err) => {
      this.Toast.showalert(err.message);
      alert(err.message)
    });
    if (response != undefined) {
      if (response.BoolVal == true) {
        this.OrderDet = []
        this.Toast.showalert('Your order has been placed successfully !');
      } else {
        this.Toast.showalert(response.error);
      }
    }
  }

  OnChangeOrderType() {
    if (this.model.OrderType === 'Dine In') {
      this.FillterTableNo = this.TablesDetails.filter((i: any) => i.TableStatus === 'Available')
      this.isPopupOpen1 = true;
    } else {
      this.FillterTableNo = [];
      this.model.TableNo = '';
      this.isPopupOpen1 = false;
    }
  }




  closePopup() {
    this.isPopupOpen = false;
  }


  async GetTablesAll() {
    this.isLoading = false
    let response: any = await this.service.GetTablesAll().catch(err => {
      alert(err.message)
      this.isLoading = true
    })
    if (response != undefined) {
      this.TablesDetails = response;
      this.isLoading = true

    } else {
      this.isLoading = true
      alert(response.error)
    }
  }

  async refreshTableData() {
    await this.GetTablesAll();
  }
}
