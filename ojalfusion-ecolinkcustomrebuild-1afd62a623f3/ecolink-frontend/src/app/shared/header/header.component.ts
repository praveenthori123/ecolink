import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchedHeaderState } from '../../store/state/header.state';
import { HeaderMenuAction } from '../../store/actions/header.action';
import { HttpErrorResponse } from '@angular/common/http';
import { CookiesService } from 'src/app/Services/cookies.service';
import { ViewportScroller } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() length: any;
  headerMenuData: any;
  isAlive = true;
  user_id: any;
  openMenu: boolean = false;
  openSubmenu: boolean = false;
  opensubSubmenu: boolean = false;
  homePageData: any = [];
  slug: any;
  data: any = []
  responseSubscribe: any = {}
  show: boolean = false;
  searchItem: string = '';
  subslug: any;
  suggestionList: any = [];
  showGlobalSearchSuggestion: any = false;
  customerLocation: string = '';

  @Select(FetchedHeaderState.getFetchedHeader) headerMenu$!: Observable<any>;
  @Select(FetchedHeaderState.getFetchedHeaderLoad) headerMenuDataLoaded$!: Observable<boolean>;

  constructor(private scroller: ViewportScroller, private _cookies: CookiesService, private route: Router, private __apiservice: ApiServiceService, private store: Store, private router: Router) { }
  routes: any = [
    {
      "id": "1",
      "route": ""
    },
    {
      "id": "2",
      "route": "/shop"
    },
    {
      "id": "3",
      "route": "/media"
    },
    {
      "id": "4",
      "route": "/ask-chemist"
    },
    {
      "id": "5",
      "route": "/blog"
    },
    {
      "id": "6",
      "route": "/"
    },
    {
      "id": "7",
      "route": "/shop"
    },
    {
      "id": "8",
      "route": "/about-us"
    },
  ];

  addressArray: any = []
  ngOnInit() {
    if(localStorage.getItem('ecolink_user_credential')) {
      this.__apiservice.checkforuser()
      .then((res:any)=> {
        console.log(res);
      })
      .catch((error:any)=> {
        if(localStorage.getItem('string')) {
          localStorage.removeItem('ecolink_user_credential');
          this.route.navigateByUrl("/profile");
        }
      })
    }
    this.getAllHeaderMenu();
    this.headerMenu$.subscribe(res => {
      this.homePageData = [];
      if (res.data) {
        res.data.pages.map((response: any) => {
          this.homePageData.push(response);
        });
      }
    });


    this.__apiservice.UserLocation.subscribe(res => {
      if (res) {
        let pincode = res[5] ? res[5].long_name : "US";
        let Location = res[3] ? res[3].long_name : 'Decatur';
        this.customerLocation = Location + "" + "," + " " + pincode;
      }
    });

    this.cartCountFunction();
    this.getSubscribeMsg();
  }
  // ngOnChanges() {
  //   this.cartCountFunction();
  // }
  getSubscribeMsg() {
    this.__apiservice.subscribedmsg.subscribe((res: any) => {
      this.responseSubscribe = res;
    })
  }
  //Get product count from cart 
  cartInfo: any = [];
  async cartCountFunction() {
    if (localStorage.getItem('ecolink_user_credential') != null) {
      this.__apiservice.GetCart.subscribe(resp => {
        if (resp.length > 0) {
          if(resp[0].string == 'empty'){
            this.length = 0;
          }
          else if(resp.string == undefined){
            this.length = resp.length;
          }
        }
        else {
          this.__apiservice.getItemFromCart()
            .then(res => {
              if (res.data) {
                this.length = res.data.length;
                if(res.data.length == 0){
                  this.length = 0;
                }
              }
            })
            .catch((error: any) => {
              // this.length = 0;
            })
        }
      })
      // this.__apiservice.GetCart.subscribe(async res => {
      //   if (res.length > 0) {
      //     console.log("If Condition");
      //     console.log(res);
      //     this.length = res.data.length;
      //   }

      // else {
      //   console.log("Call Api");
      //   this.__apiservice.getItemFromCart()
      //   .then(resp=>{
      //     console.log(resp);
      //     if(res.data.length){
      //       this.length = res.data.length; 
      //     }           
      //   })   
      //   .catch((error)=>{
      //     if(error.error){
      //       console.log("error");
      //       this.length = 0;              
      //     }
      //   })         
      // }
      // })
      // this.__apiservice.GetCart.subscribe(async res => {
      //   if (res.data) {
      //     console.log("If Condition");
      //     this.length = res.data.length;
      //   }

      //   else {
      //     await this.__apiservice.getItemFromCart()
      //       .then(response => {
      //         if (response.data) {
      //           console.log("Else If Condition");
      //           this.cartInfo = response.data;
      //           this.length = response.data.length;
      //         }
      //       })
      //       .catch((error) => {
      //         this.length = 0;
      //         this.__apiservice.GetCart.next([]);
      //       })
      //   }
      // })
      // setTimeout(() => {
      //   this.__apiservice.GetCart.next(this.cartInfo);
      // }, 3000);

    }
    else {
      // let cookiesdata = this._cookies.GetCartData();
      let cookiesdata = localStorage.getItem("Cookies_Cart_Data");
      if(cookiesdata){
        let cartsCount = JSON.parse(cookiesdata);
        if(cartsCount.data){
          this.length = cartsCount.data.length;
        }

        else {
          this.length = 0;
        }
      }

      else {
        this.length = 0;
      }
    }
  }
  //Go to profile page if user signed in
  profile() {
    if (localStorage.getItem("ecolink_user_credential") === null) {
      this.route.navigateByUrl('/profile/auth');
    }
    else {
      this.__apiservice.toggleButton.next({});
      this.route.navigateByUrl('/profile');
    }
  }
  //open dropdown in mobile screen
  openmenu() {
    this.openMenu = !this.openMenu;
  }
  openDropDown() {
    this.openSubmenu = !this.openSubmenu
  }
  opensubDropDown() {
    console.log('subcategory')
    this.opensubSubmenu = !this.opensubSubmenu
  }
  //Suggestion when user search dynamically
  getSuggestion(data: any) {
    this.showGlobalSearchSuggestion = false;
    this.slug = data.category.slug;
    this.subslug = data.slug;
    this.searchItem = data.name;
  }
  // testMethod(value: any) {
  //   alert("Hello");
  // }
  //Global search function
  globalSearch() {
    if (this.searchItem.length > 0) {
      this.__apiservice.globalSearchData(this.searchItem).subscribe(
        res => {
          this.showGlobalSearchSuggestion = true;
          this.suggestionList = res;
        },
        (error: HttpErrorResponse) => {
          if (error.error.code == 400) {
            this.showGlobalSearchSuggestion = false;
          }
        }
      )
    }
    else {
      this.showGlobalSearchSuggestion = false;
    }
  }

  userName: string = '';
  userDetail: any;
  getAllHeaderMenu() {
    this.headerMenuData = this.headerMenuDataLoaded$.subscribe(res => {
      if (!res) {
        this.store.dispatch(new HeaderMenuAction());
      }
    })

    this.userDetail = localStorage.getItem('ecolink_user_credential');
    if (this.userDetail) {
      if(!(localStorage.getItem('usernameforheader'))) {
        let name = JSON.parse(this.userDetail);
        console.log(name.user.name);
        // if(!("url" in name.user)) {
          this.userName = name.user.name.split(" ")[0];
        // }
      }
      else {
        this.userName='';
        localStorage.removeItem('usernameforheader')
      }

      // let userinfo=[]
      // userinfo.push(JSON.parse(this.userDetail))
      // userinfo.map((response:any)=> {
      //   if("email_verified" in response.user) {
      // this.userName = response.user.name.split(" ")[0];
    }
    //   })
    // }
  }
  //Route on Same page for header link in mobile view
  routeOnSamePage(slug: any, sublink?: any, subsublink?: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    if (subsublink) {
      this.router.navigate(['/' + slug + '/' + sublink + '/' + subsublink]);
    }
    else if (sublink) {
      this.router.navigate(['/' + slug + '/' + sublink]);
    }

    else {
      this.router.navigate(['/' + slug]);
    }
  }
  //go to map, when click on location icon
  goToLocation() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/' + 'contact']);
  }

  //close subscribe mail popup 
  closeButton() {
    let object = {
      resSignupMsg: '',
      resSignupMsgCheck: '',
    }

    this.__apiservice.subscribedmsg.next(Object.assign({}, object));

  }
  //scroll down to up function
  scrollup(event: any) {
    console.log(event);
    this.responseSubscribe = event;
    this.scroller.scrollToAnchor('subscribeMsg');
  }

  //for not repeating api calling
  ngOnDestroy(): void {
    this.isAlive = false;
    this.headerMenuData.unsubscribe();
    // this.__apiservice.GetCart.unsubscribe();
  }
}