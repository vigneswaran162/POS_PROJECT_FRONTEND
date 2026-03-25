import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 

    pin: string[] = ['', '', '', ''];
  pinIndex = 0;

  numbers = ['1','2','3','4','5','6','7','8','9','0'];

   constructor(private router:Router){}



 

  enterPin(num: string) {
    if (this.pinIndex < 4) {
      this.pin[this.pinIndex] = num;
      this.pinIndex++;
    }
  }

  clearPin() {
    this.pin = ['', '', '', ''];
    this.pinIndex = 0;
  }

  onlogin(event:any){
   let password = this.pin.join('').trim()
   if(password == "1234"){
    localStorage.setItem('login', '12345678');
    this.router.navigate(["/DashBoard"])
   }
  }
}
