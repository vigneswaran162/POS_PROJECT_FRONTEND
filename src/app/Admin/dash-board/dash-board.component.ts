import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../Services/toast.service';
import { OrdermasterService } from '../../Services/ordermaster.service';
import { CommonModule } from '@angular/common';
  declare var echarts: any;

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
const chartDom = document.getElementById('orderTypeRevenueChart');
const myChart = echarts.init(chartDom);

const option = {
  tooltip: {
    trigger: 'item',
    formatter: '{b} : ₹ {c} ({d}%)'
  },
  legend: {
    show: false,
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: 'Revenue',
      type: 'pie',
      radius: '60%',
      data: this.OrderTypeRevenue.map((x: any) => ({
        name: x.OrderType,
        value: x.grandTotal
      })),
      label: {
        formatter: '{b}\n₹ {c}'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0
        }
      }
    }
  ]
};

myChart.setOption(option);
const chartDom1 = document.getElementById('salesBarChart');
    const myChart1 = echarts.init(chartDom1);

    const option1 = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: this.salesBarChart.map((item:any) => item.date)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Sales',
          type: 'bar',
          data: this.salesBarChart.map((item:any) => item.totalSales),
          barWidth: '50%'
        }
      ]
    };

    myChart1.setOption(option1);


      this.isLoading = false;
    } else {
      this.isLoading = false
      alert(response.error)
    }
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