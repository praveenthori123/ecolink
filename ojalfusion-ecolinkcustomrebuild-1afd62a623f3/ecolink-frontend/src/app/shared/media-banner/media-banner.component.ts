import { Component, Input, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-media-banner',
  templateUrl: './media-banner.component.html',
  styleUrls: ['./media-banner.component.scss']
})
export class MediaBannerComponent implements OnInit {
  @Input() data_input: any;
  moreCheck: boolean = true;
  @Output() ScrollBar = new EventEmitter<boolean>();
  // lessCheck:boolean=false
  // blogArray:any=[];
  helperArray: any = []
  count: any = 1;
  // elements:any = [];
  constructor(private _apiservice : ApiServiceService) { }
  @HostListener("window:scroll", [])
  async OnScroll() {
    if (this.bottomReached()) {
      // window.scroll(0,600)
      this.count = this.count + 1;
      console.log("Bottom");
      await this._apiservice.getAllBlogs(this.count).then(res=>{
        this.data_input = [];
        console.log(res);    
        res.data.data.map((blog: any) => {
          this.data_input.push(blog);
        })
      })
      this.data_input.map((res:any)=>{
        this.helperArray.push(res)
      })
    }  
  }
  bottomReached(): boolean {
    console.log((window.innerHeight,  window.scrollY) ,document.body.offsetHeight)
    return (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500;
  }
  ngOnInit(): void {
    console.log(this.data_input);
    this.data_input.map((res: any) => {
      this.helperArray.push(res);
    })
    console.log(this.helperArray);
  }
  // loadAllBlog() {
  //   this.moreCheck=!this.moreCheck;
  //   this.lessCheck=!this.lessCheck;
  //   this.blogArray=[]
  //   if(this.moreCheck==false) {
  //     console.log('more',this.moreCheck);
  //     this.data_input.map((res:any)=> {
  //       this.blogArray.push(res);
  //       console.log(this.blogArray)
  //     })
  //   }
  //   else {
  //     console.log('less',this.lessCheck);
  //     console.log(this.helperArray);
  //     this.helperArray.map((res:any)=> {
  //       this.blogArray.push(res);
  //       console.log(this.blogArray);
  //     })
  //   }
  // }
}
