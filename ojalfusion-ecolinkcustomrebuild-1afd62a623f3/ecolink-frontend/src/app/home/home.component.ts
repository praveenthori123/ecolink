import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  remembertoken: any;


  constructor(private scroller: ViewportScroller, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    let slug = this.route.snapshot.params;
    if (slug.token) {
      localStorage.setItem('email_token', slug.token);
      if (localStorage.getItem('ecolink_user_credential') != null) {
        this.remembertoken = localStorage.getItem('ecolink_user_credential')
        let token = JSON.parse(this.remembertoken).user.remember_token;
        if (token != null) {
          this.router.navigateByUrl('/');
        }
        else if (slug.token == this.remembertoken) {
          this.router.navigateByUrl('/');
        }
        else {
          this.router.navigateByUrl('/profile/auth');
        }
      }
      else {
        this.router.navigateByUrl('/profile/auth');
      }
    }
  }

  scrolldown(event: any) {
    this.scroller.scrollToAnchor("newsletter");
  }

}
