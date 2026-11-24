import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../Services/toast.service';
import { OrdermasterService } from '../../Services/ordermaster.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash-board',
  imports: [CommonModule],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css'
})
export class DashBoardComponent implements OnInit {
  orderCounts: any = {
    'Dine In': 0,
    'Take Away': 0,
    'Delivery': 0
  };
  isLoading: boolean;
  totalrevenue:number=0;
  OrderTypeRevenue: any;
  salesBarChart: any;
  ItemDetails: any;
  TopSellingFoods: any;
  itemImageMap: Map<string, string> = new Map();



  constructor(private Toast: ToastService, private OrderService: OrdermasterService) { }

  async ngOnInit(){
    await this.GetProducts()
   this.GetOrderTypeCount();
   this.loadChart()
  }


  async GetOrderTypeCount() {
    this.isLoading = true
    let response: any = await this.OrderService.GetOrderTypeCount().catch(err => {
      alert(err.message)
      this.isLoading = false;
    })
    if (response != undefined) {

      response.response1.forEach((item: any) => {
        this.orderCounts[item.OrderType] = item.count;

      });
      this.totalrevenue = response.response2[0].grandTotal;
      this.OrderTypeRevenue = response.response3;
      this.salesBarChart =response.response4;
this.TopSellingFoods = response.response5.map((food: any) => {
  return {
    ...food,
    ItemImage:this.itemImageMap.get(food._id.ItemCode) || null
  };
});
console.log(this.TopSellingFoods,'helooo')
      this.isLoading = false;
    } else {
      this.isLoading = false
      alert(response.error)
    }
  }




  readonly palette: string[] = ['#6c5ce7', '#ff9f43', '#00b894', '#ff6b81', '#0984e3', '#fdcb6e'];

  // ---- CSS chart helpers (presentation only) ----
  get maxSales(): number {
    const v = (this.salesBarChart || []).map((x: any) => Number(x.totalSales) || 0);
    return Math.max(1, ...v);
  }

  barHeight(value: any): number {
    return Math.round(((Number(value) || 0) / this.maxSales) * 100);
  }

  get revenueSlices(): { name: string; value: number; percent: number; color: string }[] {
    const data = this.OrderTypeRevenue || [];
    const total = data.reduce((t: number, x: any) => t + (Number(x.grandTotal) || 0), 0) || 1;
    return data.map((x: any, i: number) => ({
      name: x.OrderType,
      value: Number(x.grandTotal) || 0,
      percent: Math.round(((Number(x.grandTotal) || 0) / total) * 100),
      color: this.palette[i % this.palette.length]
    }));
  }

  get donutGradient(): string {
    let acc = 0;
    const total = this.revenueSlices.reduce((t, x) => t + x.value, 0) || 1;
    const stops = this.revenueSlices.map(sl => {
      const start = acc;
      acc += (sl.value / total) * 100;
      return `${sl.color} ${start}% ${acc}%`;
    });
    return stops.length ? `conic-gradient(${stops.join(', ')})` : 'conic-gradient(#e6e8ef 0 100%)';
  }

  loadChart() {
    
  }


  
  async GetProducts() {
    this.isLoading = true
    let response: any = await this.OrderService.GetItemAll().catch(err => {
      alert(err.message)
      this.isLoading = false
    })
    if (response != undefined) {
    this.ItemDetails = response;
     this.itemImageMap.clear();
      this.ItemDetails.forEach((event: any) => {
        if (event.ItemImage) {
          if (!event.ItemImage.startsWith("data:image")) {
            event.ItemImage = `data:image/png;base64,${event.ItemImage}`;
          }
           this.itemImageMap.set(event.ItemCode,event.ItemImage);
        }
      });
      this.isLoading = false
    } else {
      this.isLoading = false
      alert(response.error)
    }
  
}
}