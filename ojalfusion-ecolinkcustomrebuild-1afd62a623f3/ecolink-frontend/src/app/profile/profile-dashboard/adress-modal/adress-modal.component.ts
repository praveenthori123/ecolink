import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-adress-modal',
  templateUrl: './adress-modal.component.html',
  styleUrls: ['./adress-modal.component.scss']
})
export class AdressModalComponent implements OnInit {
  @Input() showdesc: any;
  @Input() profileaddress:any;
  @ViewChild('test') test: ElementRef | any;
  userObj: any;
  resAddmsg: string = ' ';
  resAddmsgCheck: string = ' ';
  resSignupMsg: string = '';
  invalidEmail: boolean = false;
  invalidUserEmail: string = '';
  invalidMobile = false;
  invalidZip = false;

  constructor(private __apiservice: ApiServiceService, private renderer: Renderer2,) { }

  ngOnInit(): void {
  }
  // <User Address Modal>
  addUserAddress(form: NgForm) {
    if (form.valid) {
      let data = Object.assign({}, form.value);
      this.userObj = {
        name: data.firstname,
        email: data.email,
        mobile: data.phonenumber,
        landmark: data.landmark,
        address: data.address,
        country: data.country,
        state: data.state,
        city: data.city,
        zip: data.pincode,
      };
      console.log(this.userObj);
      console.log(this.profileaddress);
      this.profileaddress.map((res: any) => {
        if (res.heading == 'Add Address') {
          this.__apiservice.addUserAddresses(this.userObj).subscribe(
            (res) => {
              console.log(res);
              this.__apiservice.profiledashboard.next(true);
            },
            () => {
              form.reset();
            }
          );
        }
        else {
          console.log('edit');
          this.userObj.address_id = data.id;
          this.__apiservice.editUserAddress(this.userObj).subscribe((res: any) => {
            console.log(res);
            this.__apiservice.profiledashboard.next(true);
            this.__apiservice.profiledashboard.subscribe((res:any)=> {
              console.log(res);
            })
          },
            () => {
              form.reset();
            }
          );
        }
      })
    }
    else {
      this.resAddmsg = 'Please Fill the Fields Below!';
      this.resAddmsgCheck = 'danger';
      setTimeout(() => {
        this.resAddmsg = ''
      }, 2000);
    }
    console.log()
  }
  // <-- Close toaster --> 
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  // <-- User Email Validation Start -->
  validateUserEmail(email: any) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.target.value) == false) {
      this.invalidUserEmail = 'Invalid Email Address';
      return false;
    }
    this.invalidUserEmail = '';
    return true;
  }
  validateEmail(event: any) {
    const value = event.target.value;
    if (
      value &&
      !/^[0-9]*$/.test(value) &&
      !this.validateUserEmail(event)
    ) {
      this.invalidEmail = true;
    }

    else {
      this.invalidEmail = false;
    }
  }
  // validate pincode 
  inputZip(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  validateZip(event: any) {
    const value = event.target.value;
    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 5
    ) {
      this.invalidZip = true;
    }
    else {
      this.invalidZip = false;
    }
  }
  // validate mobile number
  inputMobile(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  validateMobile(event: any) {
    const value = event.target.value;
    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 10
    ) {
      this.invalidMobile = true;
    }
    else {
      this.invalidMobile = false;
    }
  }
}
