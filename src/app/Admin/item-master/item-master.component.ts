import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemMasterModel } from '../../Model/ItemMasterModel';
import { ToastService } from '../../Services/toast.service';
import { ItemMasterService } from '../../Services/item-master.service';


@Component({
  selector: 'app-item-master',
  imports: [FormsModule],
  templateUrl: './item-master.component.html',
  styleUrl: './item-master.component.css'
})
export class 
ItemMasterComponent implements OnInit {

  model:ItemMasterModel;
  isUpdate: any;

  constructor(private Toast:ToastService,private service:ItemMasterService){}

  ngOnInit(): void {
    this.model = new ItemMasterModel();


  }

  preparemodel(){
    const mod = new ItemMasterModel();
    mod.ItemCode = this.model.ItemCode;
    mod.ItemName = this.model.ItemName;
    mod.UOM = this.model.UOM;
    mod.Rate = this.model.Rate;
    mod.Category = this.model.Category;
    mod.SubCategory = this.model.SubCategory;
    mod.ItemType = this.model.ItemType;
    mod.Void = 'N';
    mod.OpsType = 'S'
   if (this.model.ItemImage != null && this.model.ItemImage != '') {
      mod.ItemImage = this.model.ItemImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    }
    mod.OpeningStock = this.model.OpeningStock;
    return mod
  }
  
  formvalidation(): boolean {
  if (!this.model.ItemCode || this.model.ItemCode.trim() === "") {
    this.Toast.show("Please enter Item Code");
    return false;
  }

  if (!this.model.ItemName || this.model.ItemName.trim() === "") {
    this.Toast.show("Please enter Item Name");
    return false;
  }

  if (!this.model.UOM || this.model.UOM.trim() === "") {
    this.Toast.show("Please select Unit of Measure (UOM)");
    return false;
  }

  if (this.model.Rate == null || this.model.Rate === "" ) {
    this.Toast.show("Please enter a valid Rate");
    return false;
  }

  if (!this.model.Category || this.model.Category.trim() === "") {
    this.Toast.show("Please select Category");
    return false;
  }

  // if (!this.model.SubCategory || this.model.SubCategory.trim() === "") {
  //   this.Toast.show("Please select Sub Category");
  //   return false;
  // }

  if (parseFloat(this.model.Rate) <= 0) {
    alert("Rate must be greater than zero");
    return false;
  }

   if (!this.model.OpeningStock || this.model.OpeningStock.trim() === "") {
    this.Toast.show("Please enter a valid  OpeningStock");
    return false;
  }

  return true;
}

onClear(){
  this.model = new ItemMasterModel();
}

onSubmit(){
  if(this.formvalidation()){
   const editmod = this.preparemodel()
   this.CRUD(editmod)
  }
}


  async CRUD(_model:ItemMasterModel) {
    let response:any = await this.service.CRUD(_model).catch((err) => {
      // this.toast.showError(err.message,'');
           alert(err.message)
    });
   if(response != undefined){
    if (response.Boolval == true) {     
       if(this.isUpdate){
        alert('Updated')
       }else{
        alert('Saved')
       }
      
    } else {
      // this.toast.showError(response.returnerror,'');
    }
  }
   }


     displayImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.model.ItemImage = e.target?.result;
      };
      reader.readAsDataURL(file);
    }
  }

  validateOpeningStock() {
  if (!/^\d+$/.test(this.model.OpeningStock)) {
    this.model.OpeningStock = '';
  }
}


}
