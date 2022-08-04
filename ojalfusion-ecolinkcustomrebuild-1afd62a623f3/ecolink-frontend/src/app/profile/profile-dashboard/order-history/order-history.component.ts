import { Component, OnInit, Input } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  orderData: any = [];
  order: any = [];
  spinnercheck:boolean=false;
  searchProductArray: any = [];
  orderHistoryDesc: any = [];
  show: boolean = true;
  searchItem: string = '';
  suggestions: boolean = false;
  @Input() showdesc: any;
  displayModal: boolean = false;
  order_id : any;

  showModalDialog() {
    this.displayModal = true;
  }

  constructor(private __apiservice: ApiServiceService,) { }

  ngOnInit(): void {
    this.getOrderhistory();
  }
  // <-- Get Order History -->
  async getOrderhistory() {
    console.log("Order History");
    let product_search: any;
    await this.__apiservice.getOrderData()
      .then((res: any) => {
        console.log("res" , res);        
        this.orderData = res.data;
        console.log(this.orderData, "orderhistory");
        res.data.map((resp: any) => {
          resp.items.map((response: any) => {
            product_search = response.product;
          })
          this.searchProductArray.push(product_search);
        })
        this.spinnercheck=false;
      })

      .catch(error => {
        console.log(error);
      })

  }
  // <-- Order History Details for Particular Product -->
  order_product_id: any;
  showDetails(i: any, id: any) {
    console.log(i, id);
    this.order_product_id = id;
    this.orderHistoryDesc = [];
    this.orderHistoryDesc.push(i)
    console.log(this.orderHistoryDesc)
    this.show = !this.show;
  }
  // Get Search Data from search bar on order history
  getselecteddata(value: any) {
    console.log(value);
    this.searchItem = value;
    this.suggestions = false;
  }
  // Order history search bar Suggestions 
  getSuggestions() {
    if (this.searchItem.length > 0) {
      this.suggestions = true;
    }
    else {
      this.suggestions = false;
      this.orderData = this.order;
    }
  }
  // Fetch Order History Data from search Bar
  FetchSearchedData() {
    let product_search: any;
    this.orderData = []
    this.order.map((res: any) => {
      res.items.filter((resp: any) => {
        product_search = '';
        if (resp.product.name.includes(this.searchItem)) {
          product_search = res;
        }

        if (product_search) {
          console.log(product_search);
          this.orderData.push(product_search);
        }

        console.log(this.orderData);

      })
    })
  }

  // Cancel Order
  async orderCancel(id:any) {
    this.spinnercheck=true;
    await this.__apiservice.CancelOrderApi(id).then(res => {
      console.log(res);
      console.log("res.code", res.code);
      this.getOrderhistory();
    })
      .catch((error) => {
        console.log(error.status);
        this.getOrderhistory();
      })
  }




  // Return Order 

  // storeReturnProduct(i: any) {
  //   let storeObj: any;
  //   console.log(i)
  //   storeObj = {
  //     order_id: i.order_id,
  //     order_item_id: i.id,
  //     product_id: i.product_id,
  //     quantity: i.quantity,
  //     reason: "Accidentally Placed Order",
  //     description: "test"
  //   }
  //   this.__apiservice.storeReturnOrder(storeObj).subscribe(res => {
  //     console.log(res)
  //   })
  // }
  // getReturnProduct() {
  //   this.__apiservice.getReturnOrder().subscribe(res => {
  //     setTimeout(() => {
  //       console.log("returndata", res)
  //     }, 1000);
  //   })
  // }
}
