import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../Services/toast.service';
import { ItemMasterService } from '../../Services/item-master.service';

@Component({
  selector: 'app-table-master',
  imports: [CommonModule,FormsModule],
  templateUrl: './table-master.component.html',
  styleUrl: './table-master.component.css'
})
export class TableMasterComponent  {
tableModel: any = {
  TableNo: '',
  TableName: '',
  TableCapacity: 0,
  TableStatus: 'Available',
  TableFromTime: '',
  TableToTime: '',
  Void: 'N'
};

TableDetails: any[] = [];
TableDetailsList: boolean = false;

   allData: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];

  searchText: string = '';

  currentPage = 1;
  pageSize = 4;
  totalPages = 0;
  isLoading: boolean = false;

constructor(private Toast: ToastService,private ItemService: ItemMasterService) { }

ngOnInit(): void {
  this.GetItemsAll();
}

saveTable() {

}


clearTable() {
  this.tableModel = {
    TableNo: '',
    TableName: '',
    TableCapacity: 0,
    TableStatus: 'Available',
    TableFromTime: '',
    TableToTime: '',
    Void: 'N'
  };
}


prepareTableModel() {
  const mod: any = {};   // ✅ fix

  mod.TableNo = this.tableModel.TableNo;
  mod.TableName = this.tableModel.TableName;
  mod.TableCapacity = this.tableModel.TableCapacity;
  mod.TableStatus = this.tableModel.TableStatus;
  mod.TableFromTime = this.tableModel.TableFromTime;
  mod.TableToTime = this.tableModel.TableToTime;

  mod.Void = 'N';
  mod.OpsType = 'S';

  return mod;
}

tableFormValidation(): boolean {

  if (!this.tableModel.TableNo || this.tableModel.TableNo.trim() === "") {
    this.Toast.show("Please enter Table No");
    return false;
  }

  if (!this.tableModel.TableName || this.tableModel.TableName.trim() === "") {
    this.Toast.show("Please enter Table Name");
    return false;
  }

  if (this.tableModel.TableCapacity == null || this.tableModel.TableCapacity === "") {
    this.Toast.show("Please enter Table Capacity");
    return false;
  }

  if (!this.tableModel.TableStatus || this.tableModel.TableStatus.trim() === "") {
    this.Toast.show("Please select Table Status");
    return false;
  }

  // if (!this.tableModel.TableFromTime) {
  //   this.Toast.show("Please select From Time");
  //   return false;
  // }

  // if (!this.tableModel.TableToTime) {
  //   this.Toast.show("Please select To Time");
  //   return false;
  // }

  return true;
}


  onSubmit() {
    if (this.tableFormValidation()) {
      const editmod = this.prepareTableModel()
     // this.CRUD(editmod)
    }
  }



    async GetItemsAll() {
    this.isLoading = true
    let response: any = await this.ItemService.GetTablesAll().catch(err => {
      alert(err.message)
      this.isLoading = false
    })
    if (response != undefined) {
      this.TableDetails = response;
      this.calculatePagination();
      this.isLoading = false
    } else {
      this.isLoading = false
      alert(response.error)
    }
  }


    calculatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.paginatedData = this.filteredData.slice(start, end);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.calculatePagination();
  }

}
