import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { CookiesService } from 'src/app/Services/cookies.service';
import { ShippingServiceService } from 'src/app/Services/shipping-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BillingFormComponent } from '../billing-form/billing-form.component';
import { ConnectionServiceModule } from 'ng-connection-service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.component.html',
  styleUrls: ['./product-checkout.component.scss']
})
export class ProductCheckoutComponent implements OnInit {
  selectedPaymentMethod: any;
  producttotal: any = 0
  discountCheck: boolean = true;
  disableOrderButton: boolean = true;
  checkforcoupon: boolean = false;
  shippingChargeError: string = ''
  formcheck: boolean = true;
  selectedindex: any
  couponCheck: boolean = false;
  taxcheckfornonlogin: boolean = false;
  errormsg: string = '';
  taxerror: string = '';
  shippingdetail: any = {}
  couponValue: string = '';
  couponCode: any;
  rate: number = 0;
  placeordercheck: boolean = true;
  openAddressDropdown: boolean = false;
  selectedShippingMethod: string = 'fedex';
  couponDiscount: any = 0;
  showDropdowm: boolean = false;
  getAllUserAddresses: any = [];
  CheckoutProduct: any = [];
  carts: any = [];
  pincode: any;
  selectedRadioButton: any;
  formShimmer: boolean = true;
  paypalItems: any = {}
  orderObj: any;
  showPaypal: boolean = false;
  paypalProductDetails: any = {};
  paypal: any = [];
  taxCheck: boolean = false;
  paymentCheck: boolean = true;
  shippingCharge: any = 0;
  tax_exempt_user: number = 0
  checkoutShimmer: boolean = true;
  checkoutProductItem: any = {};
  public payPalConfig?: IPayPalConfig;
  shippingDataObj: any = {};
  billingUserDetail: any = [];
  fedexshippingboolean: boolean = true;
  saiashippingboolean: boolean = false;
  user_credential: any;
  SelectedAddressVariable: any = "Choose Another Address";
  verifiedUser: boolean = true;
  paymentMethod: boolean = false;
  service_charge: any = 0;
  helpershippingdetailarray: any = [];
  constructor(private __apiservice: ApiServiceService,
    private route: Router,
    private _cookies: CookiesService,
    private _ShippingApi: ShippingServiceService,
    private router: Router) { }

  async ngOnInit() {
    let servicecharge = localStorage.getItem('servicecharge');
    if (servicecharge) {
      let parsedservicecharge = JSON.parse(servicecharge)
      this.service_charge = parsedservicecharge;
    }
    console.log(this.service_charge);
    this.user_credential = localStorage.getItem('ecolink_user_credential');
    this.shippingDataObj = {
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
    await this.checkoutProduct();
    this.CheckoutProduct?.map((res: any) => {
      console.log("res : ", res);
      if (res.carts.length == 0) {
        this.route.navigateByUrl('/cart');
      }
    })
  }
  // get tax value 
  getTaxExempt() {
    console.log("working", this.shippingDataObj.tax_exempt)
    if (!(this.shippingDataObj.valid)) {
      this.rate = 0
    }
    if (localStorage.getItem('ecolink_user_credential') != null) {
      console.log("notavailble")
      this.__apiservice.getUserProfileDetail().subscribe((res: any) => {
        this.tax_exempt_user = res.data.tax_exempt;
        if (!this.tax_exempt_user) {
          console.log(this.shippingDataObj.pincode)
          let pincode = this.shippingDataObj.pincode;
          if (pincode) {
            console.log("inside if ", pincode)
            this.taxCheck = true;
            this.__apiservice.getTaxForUser(pincode).subscribe((res: any) => {
              this.rate = res.data.rate;
            },

              (error: any) => {
                this.rate = -1;
                this.taxerror = "*Enter Valid ZIP Code"
              })
          }
          else {
            this.rate = -1;
            this.taxerror = "*Enter Valid ZIP Code"
          }
        }
        else {
          this.taxCheck = false;
          this.rate = 0;
          this.taxerror = ""
        }
      })
    }
    else {
      if (this.shippingDataObj.tax_exempt == 0) {
        console.log("this.shippingDataObj", this.shippingDataObj);
        let pincode = this.shippingDataObj.pincode
        if (pincode) {
          this.__apiservice.getTaxForUser(pincode).subscribe(
            (res: any) => {
              console.log(res);
              this.taxCheck = true
              this.rate = res.data.rate;
              this.taxerror = ''
            },
            (error: any) => {
              this.taxCheck = true
              this.rate = -1;
              this.taxerror = "No Tax Found"
            }
          )
        }
      }

      else {
        this.taxCheck = false;
        this.rate = 0;
        this.taxerror = ""
      }
    }
  }

  getSelectedShippingAddress(event: any) {
    console.log("Hellow ==>", event);
    this.shippingDataObj = event;
    let pincode = this.shippingDataObj?.pincode;

    if (this.shippingDataObj) {
      console.log("its working")
      this.getProduct();
      // if(pincode){
      this.getTaxExempt();
      // }

      // else 
    }
    else {
      this.saiaValues = -1
      this.shippingChargeError = ''
      this.taxCheck = false;
    }

  }

  //route on profile page
  routeToProfile() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/profile']);
  }

  //get product for billing
  dataFromLocation: any;
  async checkoutProduct() {
    if (localStorage.getItem('ecolink_user_credential') != null) {
      await this.__apiservice.getCheckoutProducts()
        .then(res => {
          if (res) {
            console.log(res);
            if (res.code == 200) {
              this.formShimmer = false;
              this.checkoutShimmer = false;
            }
            if (res.data.carts.length == 0) {
              this.route.navigateByUrl('/cart')
            }
            res.data.addresses.map((resp: any) => {
              resp.pincode = resp.zip;
            })
            this.CheckoutProduct.push(res.data);
            this.billingUserDetail.push(res.data.user);
          }
        })

        .catch(error => {
          if (error.status == 400 || error.status == 401) {
            console.log(error.status);
            this.router.navigateByUrl('/cart')
          }
        })
      console.log("checkout", this.CheckoutProduct);
    }
    else {
      if (localStorage.getItem('Address')) {
        this.dataFromLocation = localStorage.getItem('Address')
        this.dataFromLocation = JSON.parse(this.dataFromLocation)
      }
      else {
        console.log(this.CheckoutProduct);
      }
      this.getsubjectBehaviour();
    }

    setTimeout(() => {
      // console.log("this.CheckoutProduct", this.CheckoutProduct);
      // this.paypal = [];
      // this.CheckoutProduct.map((response: any) => {
      //   console.log("response", response);
      //   response.carts.map((resp: any) => {
      //     console.log("resp.quantity", resp.quantity);
      //     this.producttotal = response.payable;
      //     this.paypalItems = {};
      //     this.paypalItems.name = resp.product.name;
      //     this.paypalItems.quantity = resp.quantity;
      //     this.paypalItems.category = "PHYSICAL_GOODS";
      //     this.paypalItems.unit_amount = { currency_code: "USD", value: resp.product.sale_price }
      //     console.log(this.paypalItems);
      //     this.paypal.push(this.paypalItems)
      //   })
      //   console.log("this.paypal", this.paypal);
      // })
      // this.getpaypalitem();
    }, 5000);



  }


  fedexSpinner: boolean = false;
  async FedexShippingObj(fedexApiObj: any) {
    this.fedexSpinner = true;
    let productDetail: any = [];

    this._ShippingApi.fedexshippingApi(fedexApiObj)
      .then((res: any) => {
        this.fedexSpinner = false;
        this.shippingChargeError = ''
        this.shippingCharge = res.rate;
        console.log(typeof this.shippingCharge);
      })
      .catch((error: any) => {
        this.fedexSpinner = false;
        console.log(error.message);
        this.shippingCharge = ''
        this.shippingChargeError = "*ZIP Code not Serviceable";
        console.log(typeof this.shippingCharge);
      })
  }

  getpaypalitem() {
    this.paypal = [];
    let discount_paypal = this.couponDiscount/this.CheckoutProduct[0]?.carts?.length;
    console.log(discount_paypal);
    this.CheckoutProduct.map((response: any) => {
      console.log("response", response);
      response.carts.map((resp: any) => {
          let main_price : any = 0;
          main_price = (((resp.product.sale_price * resp.quantity)-discount_paypal)/resp.quantity);
          console.log("main_price",main_price);
          this.producttotal = (this.producttotal + main_price);
          console.log("this.producttotal",this.producttotal);
          let twopointprice = main_price.toFixed(2);
          this.paypalItems = {};
          this.paypalItems.name = resp.product.name;
          this.paypalItems.quantity = resp.quantity;
          this.paypalItems.category = "PHYSICAL_GOODS";
          this.paypalItems.unit_amount = { currency_code: "USD", value: twopointprice }
          console.log(this.paypalItems);
          this.paypal.push(this.paypalItems)
      })
    })
  }

  // get shipping charges for product
  getProduct() {
    this.checkoutProductItem = [];
    let productDetail: any = [];
    console.log(this.shippingDataObj, this.CheckoutProduct);
    this.CheckoutProduct?.map((res: any) => {
      res.carts.map((resp: any) => {
        console.log(resp);
        productDetail.push(resp.product_id);
      })
    })
    console.log("this.CheckoutProduct", this.dataFromLocation ? this.dataFromLocation : "Not Available");
    let saiacredobj = {
      country: "",
      city: "",
      state: "",
      pincode: ""
    }
    this.dataFromLocation?.map((res: any, index: any) => {
      console.log(res);
      res.types?.map((response: any) => {
        if (response == 'postal_code') { saiacredobj.pincode = res.long_name }
        if (response == 'country') { saiacredobj.country = res.short_name; }
        if (response == 'administrative_area_level_1') { saiacredobj.state = res.short_name }
        if (response == 'locality') { saiacredobj.city = res.long_name }
      })

    })
    this.checkoutProductItem.country = this.shippingDataObj.country ? this.shippingDataObj.country : "";
    this.checkoutProductItem.state = this.shippingDataObj.state ? this.shippingDataObj.state : "";
    this.checkoutProductItem.city = this.shippingDataObj.city ? this.shippingDataObj.city : "";
    this.checkoutProductItem.zip = this.shippingDataObj.pincode ? this.shippingDataObj.pincode : "";
    this.checkoutProductItem.product_id = productDetail;
    console.log(this.checkoutProductItem);

    setTimeout(() => {
      this.getsaiashippingrate();
      this.FedexShippingObj(this.checkoutProductItem);
    }, 1500);
  }




  saiaValues: any = -1;
  saiaAmount: number = 0;
  saiaSpinner: boolean = false;

  // get product shipping info on checkout page
  getsaiashippingrate() {
    this.saiaSpinner = true;
    this._ShippingApi.rateDetailThroughSaia(this.checkoutProductItem)
      .then((res: any) => {
        this.saiaSpinner = false;
        this.saiaAmount = res.rate;
        this.saiashippingboolean = true;
        if (this.saiaAmount == 0) {
          this.saiaValues = 0;
        }
        else {
          this.saiaValues = res.rate
        }
      })
      .catch((error: any) => {
        this.saiaSpinner = false;
        this.saiaValues = 0;
      })
  }
  //get total amount of product including taxes and shipping charges
  async getOrderInfo() {
    console.log(this.CheckoutProduct);
    console.log(this.billingDetails, this.shippingDataObj);
    let products_cart: any = [];
    this.CheckoutProduct?.map((res: any) => {
      let cart_object: any = {};
      res.carts?.map((resp: any) => {
        cart_object = {};
        console.log(resp);
        cart_object.product_name = resp.product.name,
          cart_object.product_price = resp.product.sale_price,
          cart_object.quantity = resp.quantity
        products_cart.push(cart_object);
      })
    })


    // if (this.shippingDataObj.valid == true && this.billingDetails.valid == true) {
    await this.signUp();
    console.log(this.total ? this.total : this.Extra_Charges, this.total, this.Extra_Charges)
    let total_order_amount = (this.total ? this.total : this.Extra_Charges) + this.service_charge
    console.log(total_order_amount , this.service_charge , (this.total ? this.total : this.Extra_Charges))
    this.orderObj = {
      sameAsShip: 0,
      order_amount: this.CheckoutProduct[0].payable,
      product_discount: 0,
      coupon_discount: this.couponDiscount,
      total_amount: total_order_amount.toFixed(2),
      billing_name: this.billingUserDetail[0]?.name ? this.billingUserDetail[0]?.name : this.shippingDataObj.name,
      billing_email: this.billingUserDetail[0]?.email ? this.billingUserDetail[0]?.email : this.shippingDataObj.email,
      billing_mobile: this.billingUserDetail[0]?.mobile ? this.billingUserDetail[0]?.mobile : this.shippingDataObj.mobile,
      billing_address: this.billingUserDetail[0]?.address ? this.billingUserDetail[0]?.address : this.shippingDataObj.address,
      billing_landmark: this.billingUserDetail[0]?.address ? this.billingUserDetail[0]?.address : this.shippingDataObj.address,
      billing_country: this.billingUserDetail[0]?.country ? this.billingUserDetail[0]?.country : this.shippingDataObj.country,
      billing_state: this.billingUserDetail[0]?.state ? this.billingUserDetail[0]?.state : this.shippingDataObj.state,
      billing_city: this.billingUserDetail[0]?.city ? this.billingUserDetail[0]?.city : this.shippingDataObj.city,
      billing_zip: this.billingUserDetail[0]?.pincode ? this.billingUserDetail[0]?.pincode : this.shippingDataObj.pincode,
      shipping_name: this.shippingDataObj.name,
      shipping_email: this.shippingDataObj.email,
      shipping_mobile: this.shippingDataObj.mobile,
      shipping_address: this.shippingDataObj.address,
      shipping_landmark: this.shippingDataObj.landmark ? this.shippingDataObj.landmark : this.shippingDataObj.city,
      shipping_country: this.shippingDataObj.country,
      shipping_state: this.shippingDataObj.state,
      shipping_city: this.shippingDataObj.city,
      shipping_zip: this.shippingDataObj.pincode ? this.shippingDataObj.pincode : this.shippingDataObj.pincode,
      payment_via: this.selectedPaymentMethod,
      shippment_via: this.selectedShippingMethod,
      no_items: '1'
    }
    this.__apiservice.storeOrder(this.orderObj).subscribe(
      (res: any) => {
        console.log("Succesfully", this.shippingAmount);
        this.total_detail.payable = this.CheckoutProduct[0].payable;
        this.total_detail.shippingCharge = this.shippingAmount;
        this.total_detail.total_amount = this.total?this.total:this.Extra_Charges;
        this.total_detail.coupon_discount = this.couponDiscount;
        this.total_detail.tax = this.rate > 0 ? this.rate : 0;
        this.total_detail.order_id = res.data.order_no
        console.log(products_cart);
        products_cart.push(this.total_detail);
        localStorage.setItem("OrderInfo", JSON.stringify(products_cart));
        setTimeout(() => {
          this.route.navigateByUrl('thanks');
        }, 1000);
        this.__apiservice.GetCart.next([]);
      },
      (error: any) => {
        this.route.navigateByUrl('failed')
      }
    );
    // }
  }

  shippingAmount: any;
  Extra_Charges: any = 0;
  total_detail: any = {};

  gettotaldetail() {
    console.log("TotalAmount", this.CheckoutProduct);
    if (this.selectedShippingMethod == 'fedex') {
      this.Extra_Charges = this.shippingCharge + this.CheckoutProduct[0]?.payable - this.couponDiscount + this.rate;
      this.shippingAmount = this.shippingCharge;
      console.log(this.Extra_Charges);
    }

    else {
      let saiaAmount = Number(this.saiaValues);
      console.log(saiaAmount + this.CheckoutProduct[0].payable);
      this.Extra_Charges = saiaAmount + this.CheckoutProduct[0].payable - this.couponDiscount + this.rate;
      this.shippingAmount = saiaAmount;
    }
    if (this.selectedPaymentMethod == 'paypal') {
      this.gettotalamountforpaypal();
    }
  }
  total: any = 0;
  gettotalamountforpaypal() {
    this.total=0
    this.paypalItems = {};
    let standardtotal = this.shippingAmount + this.service_charge + this.rate;
    console.log("standardtotal",standardtotal);
    console.log("Extra_Charges",this.Extra_Charges);
    console.log("producttotal",this.producttotal);
    console.log("service_charge",this.service_charge);
    let standardtotal1 = standardtotal.toFixed(2);
    this.paypalItems.name = "Standard Product";
    this.paypalItems.quantity = 1;
    this.paypalItems.category = "PHYSICAL_GOODS";
    this.paypalItems.unit_amount = { currency_code: "USD", value: (standardtotal1) }
    if(standardtotal1>0) {
      this.paypal.push(this.paypalItems);
    }
    this.paypal?.map((response: any) => {
      console.log(response);
      this.total += (response.unit_amount.value) * response.quantity;
    })
    console.log(this.total);
    console.log(this.Extra_Charges, this.producttotal);
    this.initConfig();
  }
  // dynamic paypal binding and integration
  private initConfig(): void {
    if (this.total > 0) {
      this.payPalConfig = {
        currency: 'USD',
        clientId: 'AX8Dyud-bw5dJEEKvuTkv5DJBH89Ahs4yf8RagOrGwjaeDPs0quiWiQAN8wuoOZu-mByocZMmxeAzrS2',
        createOrderOnClient: (data) => <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: this.total,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: this.total
                }
              }
            },
            items: this.paypal
          }]
        },
        advanced: {
          commit: 'true'
        },
        style: {
          label: 'paypal',
          layout: 'vertical',
          size: 'small',
          color: 'blue',
          shape: 'rect'
        },
        onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get().then((details: any) => {
            console.log('onApprove - you can get full order details inside onApprove: ', details);
          });
        },
        onClientAuthorization: (data) => {
          if (data.status == 'COMPLETED') {
            this.getOrderInfo();
            this.route.navigateByUrl('thanks');
          }
          else {
            this.route.navigateByUrl('failed');
          }
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        },
        onCancel: (data, actions) => {
          console.log('OnCancel', data, actions);

        },
        onError: err => {
          console.log('OnError', err);
        },
        onClick: (data, actions) => {
          console.log('onClick', data, actions);
        }
      };
    }
  }
  // enable and disable payment tabs

  updatepaymentmethod() {
    this.selectedPaymentMethod = '';
  }
  checkPaymentTab() {
    this.paymentMethod = true;
    console.log(this.shippingDataObj);
    if (this.selectedPaymentMethod == 'cod') {
      this.paymentCheck = false;
      this.showPaypal = false;
      this.gettotaldetail();
      console.log(this.paymentCheck);
    }
    else if (this.selectedPaymentMethod == "paypal") {
      // if (this.shippingDataObj.valid == true && this.billingDetails.valid == true) {
      this.paymentCheck = true;
      this.showPaypal = true;
      this.getpaypalitem();
      this.gettotaldetail();
      // }
      console.log(this.paymentCheck);
    }

    // let verification = JSON.parse(this.user_credential);
    // console.log(verification.user);
    // if (verification.user?.email_verified == 0) {
    //   this.verifiedUser = false;
    //   console.log(this.verifiedUser);
    // }
  }
  cookiesCheckout: any = {}
  //get cookies data on cart
  getsubjectBehaviour() {
    let cookiesObj: any = [];
    let data_obj: any = [];
    let completedFormat: any = {};
    // cookiesObj = this._cookies.GetCartData();
    cookiesObj = localStorage.getItem("Cookies_Cart_Data");
    let Object = JSON.parse(cookiesObj);
    console.log(Object);
    if (Object.data?.length > 0) {
      completedFormat.carts = Object.data;
      data_obj.push(completedFormat);
      setTimeout(() => {
        this.refractorData(data_obj);
        this.formShimmer = false;
        this.checkoutShimmer = false;
      }, 1000);
    }
    console.log(data_obj);



    // if (cookiesObj.length > 0) {
    //   cookiesObj.map((res: any) => {
    //     this.__apiservice.getProductById(res.CartProductId).then((resp: any) => {
    //       console.log("resp", resp);
    //       let data: any = {};
    //       let products: any = {};
    //       data.quantity = res.ProductQuantity;
    //       data.product_id = resp.data.id;
    //       products.id = res.CartProductId;
    //       products.name = resp.data.name;
    //       products.sale_price = resp.data.sale_price;
    //       products.image = resp.data.image;
    //       products.alt = resp.data.alt;
    //       data.product = products;
    //       data_obj.push(data);
    //       completedFormat.carts = data_obj;
    //     })
    //     this.cookiesCheckout.data = completedFormat;
    //     console.log(this.cookiesCheckout);
    //   })
    //   setTimeout(() => {
    //     this.refractorData();
    //     this.formShimmer = false;
    //     this.checkoutShimmer = false;
    //   }, 1000);
    // }
    // else {
    //   console.log("Empty");

    //   this.route.navigateByUrl('/cart');
    // }
  }

  async refractorData(data_obj: any) {
    console.log(data_obj);
    console.log(this.dataFromLocation);
    let userSelectedLocation: any = {};
    let user: any = {};
    this.dataFromLocation?.map((res: any, index: any) => {
      res.types?.map((response: any) => {
        // console.log(response);
        if (response == 'postal_code') { userSelectedLocation.pincode = res.long_name }
        if (response == 'country') { userSelectedLocation.country = res.long_name; }
        if (response == 'administrative_area_level_1') { userSelectedLocation.state = res.long_name }
        if (response == 'locality') { userSelectedLocation.city = res.long_name }
        if (response == 'sublocality') { userSelectedLocation.address = res.long_name }
      })
    })

    user = {
      name: "",
      email: "",
      mobile: "",
      country: userSelectedLocation.country ? userSelectedLocation.country : "",
      address: userSelectedLocation.address ? userSelectedLocation.address : "",
      city: userSelectedLocation.city ? userSelectedLocation.city : "",
      state: userSelectedLocation.state ? userSelectedLocation.state : "",
      pincode: userSelectedLocation.pincode ? userSelectedLocation.pincode : "",

    }

    this.dataFromLocation?.map((res: any, index: any) => {
      res.types?.map((response: any) => {
        if (response == 'postal_code') { user.pincode = res.long_name }
        if (response == 'country') { user.country = res.long_name; }
        if (response == 'administrative_area_level_1') { user.state = res.long_name }
        if (response == 'locality') { user.city = res.long_name }
        if (response == 'sublocality') { user.address = res.long_name }
      })
      user.name = "";
      user.email = "";
      user.mobile = ""
    })

    // this.billingUserDetail.push(user);
    let CheckoutDetail: any = {};
    let subtotalProduct: any;
    let subtotal = localStorage.getItem("payable");
    if (subtotal) {
      subtotalProduct = JSON.parse(subtotal);
    }
    console.log("this.billingUserDetail", this.billingUserDetail, data_obj);
    data_obj.map((res: any) => {
      res.user = user;
      res.payable = subtotalProduct;
    })

    CheckoutDetail.data = data_obj;
    console.log(CheckoutDetail);
    this.CheckoutProduct = CheckoutDetail.data;
    // this.cookiesCheckout.data.user = user;
    // this.cookiesCheckout.data.payable = localStorage.getItem('payable');
    // console.log(this.cookiesCheckout, "this.cookiesCheckout");
    // let product_data = [];
    // product_data.push(this.cookiesCheckout.data);
    console.log(this.CheckoutProduct, "product_data");
    // this.CheckoutProduct = product_data;
    // this.getTaxExempt();
  }

  //collect product information to send paypal
  payment: any;
  // get coupon discount on product
  coupon_code: string = '';
  couponButton() {
    this.selectedPaymentMethod='';
    if (this.couponValue) {
      this.couponDiscount = 0
      this.addremovedcoupon = 0
      this.coupon_code = this.couponValue;
      this.CheckoutProduct?.map((res: any) => {
        console.log(res);
        if (res.coupons?.length > 0) {

          res.coupons.map((response: any) => {
            console.log(this.coupon_code == response.code, this.coupon_code, response.code)
            if (this.couponDiscount == 0) {
              if (this.coupon_code == response.code) {
                console.log("checking for if")
                if (response.disc_type == 'percent' && response.discount < 100) {
                  this.couponDiscount = res.payable * response.discount / 100;
                  this.addremovedcoupon=0
                  this.errormsg = ''
                  this.couponCheck = true;
                  console.log(this.couponDiscount)
                }
                else if (response.disc_type == 'amount' && response.discount < res.payable) {
                  this.couponDiscount = response.discount;
                  this.addremovedcoupon=0
                  this.errormsg = ''
                  this.couponCheck = true;
                  console.log(this.couponDiscount)
                }
                else {
                  this.couponDiscount = 0
                  this.addremovedcoupon=0
                  console.log("checking for coupon")
                  this.errormsg = '*Invalid Coupon Code'
                  this.discountCheck = true;
                  this.couponCheck = false;
                  setTimeout(() => {
                    this.errormsg = '';
                  }, 2000);
                }
                // this.discountCheck = false;
              }
              else {
                this.couponDiscount = 0
                this.addremovedcoupon=0
                console.log("checking for coupon")
                this.errormsg = '*Invalid Coupon Code'
                this.discountCheck = true;
                this.couponCheck = false;
                setTimeout(() => {
                  this.errormsg = '';
                }, 2000);
              }
            }
          })

        }
        else {
          this.couponDiscount = 0
          this.addremovedcoupon=0
          console.log("checking for coupon")
          this.errormsg = '*Invalid Coupon Code'
          this.discountCheck = true;
          this.couponCheck = false;
          setTimeout(() => {
            this.errormsg = '';
          }, 2000);
        }
      })
      // this.errormsg = '';
    }
    else {
      this.removediscount()
      this.couponCheck = false;
      this.errormsg = '*Please Enter Coupon Code'
      setTimeout(() => {
        this.errormsg = '';
      }, 2000);
    }
  }

  addremovedcoupon: any = 0;

  removediscount() {
    this.selectedPaymentMethod='';
    this.couponCheck = false;
    this.couponValue = '';
    this.addremovedcoupon = this.couponDiscount;
    this.couponDiscount=0
  }

  billingDetails: any;

  getDiscountvalue() {
    this.couponValue = this.couponCode;
    console.log(this.couponCode);
    console.log(this.couponValue);
  }

  PaymentCheck(event: any) {
    this.selectedPaymentMethod = event;
    this.showPaypal = false;
  }


  userObj: any;
  resSignupMsg: any = '';
  resSignupMsgCheck: any = ''



  async signUp() {
    if (!localStorage.getItem('ecolink_user_credential')) {
      await this.__apiservice.postCheckout(this.shippingDataObj).then(
        (res) => {
          console.log(res);
          if (res.code == 200) {
            window.scroll(0, 0)
            this.resSignupMsg = "Verification mail has been sent to your Email Id !";
            this.resSignupMsgCheck = 'success'
            localStorage.setItem(
              'ecolink_user_credential',
              JSON.stringify(res.data));
            localStorage.setItem('usernameforheader', "username")
            this.route.navigateByUrl('/shop/checkout');
            this.SaveCookiesDataInCart();
          }
          else {
            localStorage.removeItem('ecolink_user_credential');
          }
        },
        (error: HttpErrorResponse) => {
          // this.FormFillUp.emit(false);
          window.scroll(0, 0)
          if (error.error.code == 400) {
            if (error.error.message.email) {
              this.resSignupMsg = error.error.message.email;
            }
            if (error.error.message.password) {
              this.resSignupMsg = error.error.message.password;
            }
            if (error.error.message.mobile) {
              this.resSignupMsg = error.error.message.mobile;
            }
            if (error.error.message.tax_exempt) {
              this.resSignupMsg = error.error.message.tax_exempt;
            }
            this.resSignupMsgCheck = 'danger';
          }
        });
    }
  }

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
    // this.FormFillUp.emit(false);
  }


  // gettaxexemptionvalue(event: any) {
  //   console.log(event);
  //   this.taxcheckfornonlogin = event;
  //   this.taxCheck = event;
  //   console.log(this.taxcheckfornonlogin)
  //   if (localStorage.getItem('ecolink_user_credential') == null) {
  //     this.getTaxExempt();
  //   }
  // }
}
