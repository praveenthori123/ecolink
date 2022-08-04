import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
 slug:any;
 imageurl =environment.assetsurl;
 getBlog:any=[];
  constructor(private route: ActivatedRoute, public __apiService : ApiServiceService , private router : Router) { }

  ngOnInit(): void {
    this.slug = this.route.snapshot.params;
    setTimeout(() => {
      console.log(this.slug);
    }, 500);

    this.__apiService.getBlog(this.slug).subscribe(res=>{
      this.getBlog.push(res);
      setTimeout(() => {
        console.log(this.getBlog);
      }, 500);
    })
  }
  routeOnSamePage(slug: any) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/' + slug]);
  }
}
