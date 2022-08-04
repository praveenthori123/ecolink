import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { CookiesService } from 'src/app/Services/cookies.service';
@Component({
  selector: 'app-billing-form',
  templateUrl: './billing-form.component.html',
  styleUrls: ['./billing-form.component.scss']
})
export class BillingFormComponent implements OnInit {
  // @Input() formShimmer: boolean = false;
  // @Output() FormFillUp = new EventEmitter<boolean>(false);
  // @Output() openclosefunction = new EventEmitter<boolean>(false);
  // @Output() placeordercheck = new EventEmitter<boolean>(false);
  // @Output() billingDetails = new EventEmitter<any>();
  // @Output() shippingDetail = new EventEmitter<any>();
  // @Output() gettaxexemptionvalue = new EventEmitter<boolean>(false);
  userObj: any;
  formcheck: boolean = false;
  checkfortexmsg: boolean = false;
  errormsg: string = ''
  shippingcheck: boolean = true
  CheckoutProduct: any = [];
  checked: boolean = false;
  invalidUserEmail: string = '';
  invalidUserEmail1: string = '';
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' ';
  invalidMobile = false;
  invalidPincode = false;
  invalidPincode1 = false;
  invalidEmail: boolean = false;
  UserLogin: any;
  dataFromLocation: any;




  CheckoutProductBackUp: any = {};
  nonloggedinuser: any = {}
  password: string = '';
  radio1: any;
  confirm_password: string = '';
  selectedRadioButton: any = '';
  getAllUserAddresses: any = [];
  shippingDataObj: any = {};
  billingUserDetail: any = [];
  formCheck: boolean = false;
  selectedAddress: any = -1;
  invalidMobile1: boolean = false;
  invalidEmail1: boolean = false;
  pincodeerror: string = '';
  formShimmer: boolean = true;


  @Output() SelectedPaymentMethod = new EventEmitter<any>();
  @Input() userBillingDetail: any;
  @Output() shippingDetail = new EventEmitter<any>();

  constructor(private __apiservice: ApiServiceService, private route: Router, private _cookies: CookiesService) {
  }

  BillingFormData: any = [];
  ngOnInit() {
    console.log("Input Value From Parent Component", this.userBillingDetail);
    console.log("result")
    this.UserLogin = localStorage.getItem('ecolink_user_credential');
    if (!this.UserLogin) {
      this.formShimmer = false;
    }
    if (this.UserLogin) {
    this.getAllUserAddress();
      this.CheckoutProductBackUp = {
        address: "",
        city: "",
        country: "",
        email: "",
        mobile: "",
        name: "",
        state: "",
        landmark: "",
        pincode: ""
      }
    }
    else {
      this.nonloggedinuser = {
        address: "",
        city: "",
        country: "",
        email: "",
        mobile: "",
        name: "",
        state: "",
        landmark: "",
        pincode: "",
        password: "",
        confirm_password: "",
        tax_exempt: ""
      }
    }
    console.log(this.CheckoutProductBackUp);
  }
  async getAllUserAddress() {
    this.getAllUserAddresses = []
    await this.__apiservice.getUserAddress().
      then((res: any) => {
        res.data.map((response: any, index: any) => {
            response.pincode = response.zip
            console.log("getAllUserAddresses", response);
            this.getAllUserAddresses.push(response);
            this.formShimmer = false;
            this.getRadioButtonValue();
        })
      })
      .catch((error:any)=> {
        this.formShimmer=false;
      })
  }

  // saveshippingdetail() {
  //   console.log("Checkout Product", this.userBillingDetail);
  //   console.log("this.CheckoutProductBackUp", this.CheckoutProductBackUp);

  //   if (!this.UserLogin) {
  //     this.CheckoutProductBackUp.map((res: any) => {
  //       res.password = this.password;
  //       res.confirm_password = this.confirm_password;
  //       res.tax_exempt = this.radio1
  //     })
  //   }

  //   console.log(this.userBillingDetail, this.CheckoutProductBackUp);


  //   // this.userBillingDetail?.map((res: any) => {
  //   //   let result = this.checkProperties(res);
  //   //   console.log("result", result);
  //   //   console.log("invalidEmail", this.invalidEmail);
  //   //   if (this.invalidEmail == true || this.invalidMobile == true) {
  //   //     res.valid = false;
  //   //     if (this.invalidEmail) {
  //   //       res.message = "Please Enter Correct mail Id"
  //   //     }
  //   //     if (this.invalidMobile) {
  //   //       res.message = "Please Enter Correct mobile number"
  //   //     }
  //   //   }

  //   //   else if (result == false) {
  //   //     res.valid = false;
  //   //     res.message = "Please fill user billing form details"
  //   //   }

  //   //   else {
  //   //     res.valid = true;
  //   //     res.message = "Success"
  //   //   }

  //   //   this.billingDetails.emit(res);
  //   // })

  //   console.log(this.userBillingDetail);
  //   console.log(this.CheckoutProductBackUp)


  //   // this.CheckoutProductBackUp.map((res: any) => {
  //   let result1 = this.checkProperties(this.CheckoutProductBackUp);
  //   console.log("result1", result1);
  //   console.log("invalidEmail", this.invalidEmail);
  //   if (this.invalidEmail1 == true || this.invalidMobile1 == true || this.password != "" &&
  //     this.password != this.confirm_password || this.password === "" && this.confirm_password != "") {
  //     this.CheckoutProductBackUp.valid = false;
  //     if (this.invalidEmail1) {
  //       this.CheckoutProductBackUp.message = "Please Enter Correct mail Id"
  //     }
  //     if (this.invalidMobile1) {
  //       this.CheckoutProductBackUp.message = "Please Enter Correct mobile number"
  //     }
  //     if (this.password != "" && this.password != this.confirm_password || this.password === "" && this.confirm_password != "") {
  //       this.CheckoutProductBackUp.message = "Please Enter Correct password"
  //     }
  //   }

  //   else if (result1 == false) {
  //     this.CheckoutProductBackUp.valid = false;
  //     this.CheckoutProductBackUp.message = "Please fill shipping form details"
  //   }

  //   else {
  //     this.CheckoutProductBackUp.valid = true;
  //     this.CheckoutProductBackUp.message = "Success"
  //   }
  //   this.shippingDetail.emit(this.CheckoutProductBackUp);
  //   // })

  // }

  resAddressMsg: any = ''
  resAddressMsgCheck: any = ''
  formvalid() {
    // if (!this.UserLogin) {
    // this.CheckoutProductBackUp.map((res: any) => {
    //   res.password = this.password;
    //   res.confirm_password = this.confirm_password;
    //   res.tax_exempt = this.radio1;
    //   if(this.radio1==0) {
    //     if(res.pincode?.length>4) {
    //       this.gettaxexemptionvalue.emit(true)
    //       this.pincodeerror=''
    //     }
    //     else {
    //       this.gettaxexemptionvalue.emit(false);
    //       this.pincodeerror='*Invaild Pincode'
    //     }
    //   }
    //   else if(this.radio1==1) {
    //     this.gettaxexemptionvalue.emit(false);
    //   }
    // })
    // } 
    // console.log(this.CheckoutProductBackUp);
    // let value = this.checkProperties(this.CheckoutProductBackUp);
    // console.log(value);
    if (this.UserLogin) {
      let value = this.checkProperties(this.CheckoutProductBackUp);
      if (value && !this.pincodeerror && !this.invalidMobile1 && !this.invalidEmail1) {
        console.log(this.CheckoutProductBackUp)

        let object = {
          name: this.CheckoutProductBackUp.name,
          email: this.CheckoutProductBackUp.email,
          mobile: this.CheckoutProductBackUp.mobile,
          landmark: this.CheckoutProductBackUp.landmark,
          address: this.CheckoutProductBackUp.address,
          country: this.CheckoutProductBackUp.country,
          state: this.CheckoutProductBackUp.state,
          city: this.CheckoutProductBackUp.city,
          zip: this.CheckoutProductBackUp.pincode,
        }

        this.__apiservice.addUserAddresses(object)
          .subscribe((res: any) => {
            console.log("Value", res);
            if (res.code == 200) {
              window.scroll(200, 200);
              this.resAddressMsg = 'Address Added Successfully'
              this.resAddressMsgCheck = 'success'
              setTimeout(() => {
                this.resAddressMsg = '',
                  this.resAddressMsgCheck = ''
              }, 3000);
              this.getAllUserAddress();
              this.formCheck = !this.formCheck;
              // this.selectedAddress=(this.getAllUserAddresses?.length)-1;
              // console.log(this.getAllUserAddresses?.length)
              // console.log(this.selectedAddress)
            }
          }),
          (error: HttpErrorResponse) => {
            this.resAddressMsg = 'error.error.message'
            this.resAddressMsgCheck = 'danger'
          }
        this.CheckoutProductBackUp.valid = value;
        this.shippingDetail.emit(this.CheckoutProductBackUp);
      }
      else if (this.CheckoutProductBackUp.country != '' || this.CheckoutProductBackUp.state != '' || this.CheckoutProductBackUp.city != '' || this.CheckoutProductBackUp.pincode != '') {
        // this.CheckoutProductBackUp.valid = false;
        this.shippingDetail.emit(this.CheckoutProductBackUp);
      }
    }
    else {
      this.SelectedPaymentMethod.emit('');
      let value = this.checkProperties(this.nonloggedinuser);
      if (value && !this.pincodeerror && !this.invalidMobile1 && !this.invalidEmail1) {
        console.log("Non Logged In User", this.nonloggedinuser);
        this.nonloggedinuser.valid = true;
        this.shippingDetail.emit(this.nonloggedinuser);
      }
      // let object = {
      //   name: this.nonloggedinuser.name,
      //   email: this.nonloggedinuser.email,
      //   mobile: this.nonloggedinuser.mobile,
      //   landmark: this.nonloggedinuser.landmark,
      //   address: this.nonloggedinuser.address,
      //   country: this.nonloggedinuser.country,
      //   state: this.nonloggedinuser.state,
      //   city: this.nonloggedinuser.city,
      //   zip: this.nonloggedinuser.pincode,
      //   password: this.password,
      //   confirm_password: this.confirm_password,
      //   tax_exempt: this.radio1,
      // }
      // if (value && !this.pincodeerror && !this.invalidMobile1 && !this.invalidEmail1) {
      //   console.log(this.nonloggedinuser)

      //   this.nonloggedinuser.valid = value;
      //   // console.log(object);
      // }
      // else if (this.nonloggedinuser.country != '' || this.nonloggedinuser.state != '' || this.nonloggedinuser.city != '' || this.nonloggedinuser.pincode != '') {
      // this.CheckoutProductBackUp.valid = false;
      // this.shippingDetail.emit(this.nonloggedinuser);
      // }
    }
    // console.log(this.CheckoutProductBackUp);
  }

  checkProperties(obj: any) {
    for (var key in obj) {
      if (obj[key] == null || obj[key] == "" || obj[key] == 'undefined')
        return false;
    }
    return true;

  }

  // clickoncheckbox() {
  //   console.log("Hello-->", this.userBillingDetail);
  //   this.checked = !this.checked;
  //   this.CheckoutProductBackUp=[];
  //   if (this.checked) {
  //     console.log(this.CheckoutProductBackUp);
  //     this.userBillingDetail?.map((val:any) => {
  //       this.CheckoutProductBackUp.push(Object.assign({}, val))
  //     });
  //     this.getInputData();
  //     console.log(this.CheckoutProductBackUp);
  //     console.log(this.userBillingDetail)
  //   }

  //   else {
  //     this.CheckoutProductBackUp.push({
  //       address: "",
  //       city: "",
  //       country: "",
  //       email: "",
  //       mobile: "",
  //       name: "",
  //       pincode: "",
  //       state: "",
  //       landmark: ""
  //     });
  //     this.getInputData();
  //   }

  //   this.formvalid();
  // }

  // signup when user come to checkout without login


  //validate user email
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

  //validate user mobile number 
  inputMobile(event: any) {
    if (
      event.key?.length === 1 &&
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

  inputPincode(event: any) {
    if (
      event.key?.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }

  validatePincode(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 5
    ) {
      this.pincodeerror = 'Invalid ZIP Code';
    }

    else {
      this.pincodeerror = '';
    }
  }
  inputPincode1(event: any) {
    if (
      event.key?.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }

  validatePincode1(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 5
    ) {
      this.invalidPincode1 = true;
    }

    else {
      this.invalidPincode1 = false;
    }
  }

  validateUserEmail1(email: any) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.target.value) == false) {
      this.invalidUserEmail1 = 'Invalid Email Address';
      return false;
    }
    this.invalidUserEmail1 = '';
    return true;
  }

  validateEmail1(event: any) {
    const value = event.target.value;

    if (
      value &&
      !/^[0-9]*$/.test(value) &&
      !this.validateUserEmail(event)
    ) {
      this.invalidEmail1 = true;
    }

    else {
      this.invalidEmail1 = false;
    }
  }

  //validate user mobile number 
  inputMobile1(event: any) {
    if (
      event.key?.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }

  validateMobile1(event: any) {
    const value = event.target.value;

    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 10
    ) {
      this.invalidMobile1 = true;
    }

    else {
      this.invalidMobile1 = false;
    }
  }


  //close pop up
  close() {
    console.log("close");
    this.resSignupMsg = '';
  }

  //store cookies data in cart on checkout page
  SaveCookiesDataInCart() {
    this.CheckoutProduct.map((res: any) => {
      console.log(res.carts);
      res.carts.map(async (resp: any) => {
        console.log(resp);
        await this.__apiservice.addItemToCart(resp.product_id, resp.quantity, "add")
          .then((res) => {
            console.log(res);
            this._cookies.DeleteCartData();
          })

          .catch((error: any) => {
            console.log(error);
          })
      })
    })
  }


  UpdateToggle() {
    this.SelectedPaymentMethod.emit('')
    this.__apiservice.toggleButton.next('Addresses');
    this.route.navigateByUrl('/profile')
  }

  // getInputData() {
  //   console.log(this.CheckoutProductBackUp);
  //   this.shippingDetail.emit(this.CheckoutProductBackUp);
  // }

  openform() {
    this.SelectedPaymentMethod.emit('')
    if (this.UserLogin) {
      this.formCheck = !this.formCheck;
      if (!this.formCheck) {
        // this.selectedAddress = 0;
        this.getRadioButtonValue();
      }

      else {
        this.selectedAddress = -1;
        this.CheckoutProductBackUp = {
          address: "",
          city: "",
          country: "",
          email: "",
          mobile: "",
          name: "",
          state: "",
          landmark: "",
          pincode: ""
        };

        this.shippingDetail.emit(this.CheckoutProductBackUp);

      }
    }
    // else {
    //   console.log('this.formCheck',this.formCheck)
    //   this.formCheck=true;
    // }



    // if (this.formcheck == false) {
    //   this.formcheck = true;
    //   this.CheckoutProductBackUp = {
    //     address: "",
    //     city: "",
    //     country: "",
    //     email: "",
    //     mobile: "",
    //     name: "",
    //     state: "",
    //     landmark: "",
    //     pincode: ""
    //   };
    //   this.pincodeerror = ''
    //   this.invalidMobile1 = false;
    //   this.gettaxexemptionvalue.emit(false);
    //   this.openclosefunction.emit(true);
    // }
    // else {
    //   this.formcheck = false;
    //   this.gettaxexemptionvalue.emit(true);
    //   this.openclosefunction.emit(false);
    // }
  }

  editbillingdetail() {
    this.__apiservice.toggleButton.next('Edit Profile');
    this.route.navigateByUrl('/profile')
  }

  //get radio button value for addresses

  getRadioButtonValue() {
    this.SelectedPaymentMethod.emit('')
    this.getAllUserAddresses.map((res: any, index: any) => {
      if (index == this.selectedAddress) {
        res.valid = true;
        this.shippingDetail.emit(res);
      }
    })
    // console.log(value);
    // // this.shippingChargeError = ''
    // // this.shippingCharge = ''
    // // this.saiaValues = 0;
    // // this.selectedPaymentMethod = ''
    // if (localStorage.getItem('ecolink_user_credential') != null) {
    //   this.selectedRadioButton = value;
    //   if (this.formcheck) {
    //     // this.billingUserDetail = []
    //     // console.log(this.getAllUserAddresses);
    //     this.CheckoutProduct[0].user = this.getAllUserAddresses[value];
    //     this.shippingDataObj = this.getAllUserAddresses[value];
    //     // this.billingUserDetail.push(this.getAllUserAddresses[value]);
    //     console.log("this.billingUserDetail", this.billingUserDetail);
    //     console.log("this.shippingDataObj", this.shippingDataObj);
    //     // this.getProduct();
    //     // this.getTaxExempt();
    //   }
    // }
  }

  gotoprofile(string:any) {
    console.log(this.nonloggedinuser.tax_exempt,"this.nonloggedinuser.tax_exempt")
    if (string) {
      this.checkfortexmsg = true
      this.nonloggedinuser.string = "fromcheckout";
    }
    else {
      this.checkfortexmsg = false;
    }
  }

  clicktosignup() {
    this.__apiservice.nonloginuserdetail.next(this.nonloggedinuser)
    this.route.navigateByUrl('/profile');
  }
}
