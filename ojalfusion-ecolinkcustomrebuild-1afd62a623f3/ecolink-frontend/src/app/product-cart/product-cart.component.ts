import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { CookiesService } from 'src/app/Services/cookies.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['./product-cart.component.scss']
})
export class ProductCartComponent implements OnInit {
  CardShow: any = [];
  totalqty: number = 0
  imageurl = environment.assetsurl;
  liftservice: any = [];
  length: any = 0
  SubTotal: number = 0;
  UserLogin: any;
  CartShimmer: boolean = true;
  cartUpdated: boolean = false;

  constructor(private _ApiService: ApiServiceService, private _cookies: CookiesService, private route: Router, private store: Store) { }
  async ngOnInit() {
    this.UserLogin = localStorage.getItem('ecolink_user_credential');
    this.getCartData();
  }



  //get products which added in cart
  cartInfo: any = [];
  localCookies: any;
  async getCartData() {
    let data_object: any = {}
    if (this.UserLogin === null) {
      this._ApiService.GetCart.subscribe(res => {
        console.log(res.data);
        if (res.data?.length > 0) {
          console.log(res);
          this.CardShow = res.data;
          this.subtotal();
          this.CartShimmer = false;
          this.length = this.CardShow.length;
        }

        else {
          this.localCookies = localStorage.getItem("Cookies_Cart_Data");
          if (this.localCookies) {
            let cookieData = JSON.parse(this.localCookies);
            console.log(cookieData);

            if (cookieData.data?.length > 0) {
              console.log("cookieData", cookieData);
              this.CardShow = cookieData.data;
              this.subtotal();
              this.CartShimmer = false;
              this.length = this.CardShow.length;
            }

            else {
              this.CardShow = [];
              this.CartShimmer = false;
            }
          }

          else {
            this.CardShow = [];
            this.CartShimmer = false;
          }

        }

      })

      data_object.data = this.CardShow;
      this._ApiService.GetCart.next(data_object);


    }
    else {
      this._ApiService.GetCart.subscribe(async (res) => {
        console.log(res);
        if (res?.length > 0) {
          if (res[0].string == 'empty') {
            console.log("first if");
            this.CardShow = [];
            this.length = this.CardShow.length;
            this.CartShimmer = false;
            this.totalqty = 0;
            res?.map((response: any) => {
              this.totalqty += response.quantity;
              console.log(this.totalqty, response.quantity)
            })
          }
          else if (res.string == undefined) {
            console.log("first elseif");
            this.CardShow = res;
            this.subtotal();
            this.CartShimmer = false;
            this.length = this.CardShow.length;
            this.totalqty = 0;
            res?.map((response: any) => {
              this.totalqty += response.quantity;
              console.log(this.totalqty, response.quantity)
            })
          }
        }
        else if (res?.length == 0) {
          await this._ApiService.getItemFromCart()
            .then((resp) => {
              console.log("else block");
              this.cartInfo = resp.data;
              this.CardShow = resp.data;
              this.subtotal();
              this.CartShimmer = false;
              this.totalqty = 0;
              resp?.map((response: any) => {
                this.totalqty += response.quantity;
                console.log(this.totalqty, response.quantity)
              })
            })

            .catch((error) => {
              console.log("catch block");
              if (error.error) {
                this.CardShow = [];
                this.subtotal();
                this.CartShimmer = false;
                this.cartInfo = [];
                this.totalqty += 0;
              }
            })
        }
      });

      if(this.cartInfo?.length > 0){
        this._ApiService.GetCart.next(this.cartInfo);
      }

      this.cartUpdated = false;
    }
  }


  //get total amount of all product
  subtotal() {
    this.SubTotal = 0;
    console.log("Subtotal", this.CardShow);

    this.CardShow.map((res: any) => {
      this.SubTotal = this.SubTotal + res.product.sale_price * res.quantity;
    })
  }

  //increase and decrease product quantity for non logged in user
  Count(string: any, id: any) {
    if (string == "add") {
      if (this.CardShow[id].quantity <= 24) {
        this.CardShow[id].quantity = this.CardShow[id].quantity + 1;
        this.subtotal();
      }
    }
    if (string == "delete") {
      if (this.CardShow[id].quantity >= 2) {
        this.CardShow[id].quantity = this.CardShow[id].quantity - 1;
        this.subtotal();
      }
    }
  }


  //update cart item in local storage for non logged in and api call for logged in
  ItemCart: any;
  ItemIncrease: boolean = false;
  async UpdateCart(action: any, product_id: any, product_quantity: any, rowIndex: any) {
    this.liftservice = [];
    this.liftcharges = 0
    if (this.UserLogin === null) {
      this.CartShimmer = true;
      this.Count(action, rowIndex);
      let cookiesObject: any = {};
      console.log(this.CardShow, product_quantity, "CardShow");
      this.CartShimmer = false;
      cookiesObject.data = this.CardShow;
      localStorage.setItem("Cookies_Cart_Data", JSON.stringify(cookiesObject));
      this.subtotal();
    }
    else {
      this.cartUpdated = true;
      if (action == 'delete') {
        this.ItemCart = await this._ApiService.addItemToCart(product_id, 1, action)
          .then((res) => {
            return res;
          })
          .catch(error => {
            console.log(error);
            if (error.status == 400) {
              this.cartUpdated = false;
            }
          })

        if (this.ItemCart) {
          this._ApiService.GetCart.next(this.ItemCart.data);
          this.subtotal();
        }
        else {
          this._ApiService.GetCart.next([]);
        }
      }

      else if (action == 'add') {
        this.ItemCart = await this._ApiService.addItemToCart(product_id, 1, action).then((res) => {
          return res;
        })

        if (this.ItemCart) {
          this._ApiService.GetCart.next(this.ItemCart.data);
          this.subtotal();
        }

        else {
          // this._ApiService.GetCart.next([]);
          this.cartUpdated = false;
        }
      }
      else {
        this.getCartData();
        this.subtotal();
      }
      this.cartUpdated = false;
    }
  }

  //delete cart item from local storage for non logged in and api call for logged in
  cookies_data: any = [];
  local_data: any = [];
  async deleteItemFromCart(product: any) {
    this.liftservice = [];
    this.liftcharges = 0
    let CartData: any = {};
    if (this.UserLogin != null) {
      this.cartUpdated = true;
      this.ItemCart = await this._ApiService.deleteItemFromCart(product.product.id)
        .then((res) => {
          if (res.code == 200) {
            console.log(res);
            this.CardShow = res.data;
            this.cartUpdated = false;
            if (res.data?.length == 0) {
              this.CardShow = [];
              this.length = this.CardShow.length;
            }
            return res.data;
          }
        })
        .catch((error) => {
          this.CardShow = [];
          this.length = this.CardShow.length;
        })
    }
    else {
      this.CartShimmer = true;
      this.CardShow.map((res: any, index: any) => {
        console.log(res.product_id, product.product_id);
        if (res) {
          if (res.product_id == product.product_id) {
            this.CardShow.splice(index, 1)
          }
        }
      })
      this.CartShimmer = false;
      console.log(this.CardShow.length);
      CartData.data = this.CardShow;
      this.length = this.CardShow?.length;
      console.log("length", length);
      localStorage.setItem("Cookies_Cart_Data", JSON.stringify(CartData));
    }


    if (this.ItemCart?.length > 0) {
      this._ApiService.GetCart.next(this.ItemCart);
    }

    else {
      console.log("empty");
      this._ApiService.GetCart.next([{ string: 'empty' }]);
    }


  }

  //Calculate Service Charges
  liftcharges: any = 0
  getservicevalue() {
    console.log(this.liftservice);
    if (this.liftservice[0]) {
      if (this.UserLogin) {
        console.log(this.totalqty, typeof (this.totalqty));
        this.liftcharges = this.totalqty * 150;
        localStorage.setItem('servicecharge', this.liftcharges);
      }
      else {
        let product_detail = localStorage.getItem('Cookies_Cart_Data')
        let parsed_product_detail;
        if (product_detail) {
          parsed_product_detail = JSON.parse(product_detail);
          console.log(parsed_product_detail);
        }
        parsed_product_detail.data?.map((response: any) => {
          this.liftcharges += response.quantity * 150;
        })
        console.log(this.liftcharges);
        localStorage.setItem('servicecharge', this.liftcharges);
      }
    }
    else {
      this.liftcharges = 0;
      localStorage.removeItem('servicecharge');
    }
  }

}
