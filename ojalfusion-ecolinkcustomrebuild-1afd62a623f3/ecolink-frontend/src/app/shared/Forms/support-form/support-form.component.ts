import {
  Component,
  Renderer2,
  AfterViewInit,
  ViewChild,
  ElementRef, OnInit
} from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router } from "@angular/router";
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-support-form',
  templateUrl: './support-form.component.html',
  styleUrls: ['./support-form.component.scss']
})
export class SupportFormComponent implements OnInit, AfterViewInit {
  @ViewChild('test') test: ElementRef | any;
  userObj: any;
  invalidUserEmail: string = '';
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' ';
  invalidMobile = false;
  invalidEmail: boolean = false;
  invalidPincode:boolean=false;
  checkBoxChcek: boolean = false;
  submitted = false;

  constructor(private _apiService: ApiServiceService, private renderer: Renderer2, private scroller: ViewportScroller, private router: Router) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() { }
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  goToTop() {
    this.scroller.scrollToAnchor("backToTop");
  }
  supportForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    lastname: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    streetaddress: new FormControl(''),
    country: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    state: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    city: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    pincode: new FormControl('', Validators.required),
    textarea: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
  }, { updateOn: 'blur' }
  );
  saveSupportFormDetail() {
    this.submitted = true;
    if (this.supportForm.valid) {
      let data = this.supportForm.value
      this.userObj = {
        first_name: data.firstname,
        last_name: data.lastname,
        email: data.email,
        type: "technical",
        phone: data.phone,
        address_1: data.address,
        country: data.country,
        state: data.state,
        city: data.city,
        zip: data.pincode,
        input_1: data.textarea,
      };
      this._apiService.submitFormDetail(this.userObj).subscribe((res: any) => {
        console.log(res);
        this.supportForm.reset();
        // Remove validators after form submission
        Object.keys(this.supportForm.controls).forEach(key => {
          this.supportForm.controls[key].setErrors(null)
        });
        this.checkBoxChcek = false
        this.submitted = false;
        this.resSignupMsg = 'Form Submitted Successfully!';
        this.resSignupMsgCheck = 'success';
        setTimeout(() => {
          this.resSignupMsg = '';
        }, 4000);
      }
      )
    }
    else {
      this.resSignupMsgCheck = 'danger';
      this.resSignupMsg = 'Please Fill the Fields Below!';
      setTimeout(() => {
        this.resSignupMsg = '';
      }, 3000);
    }
  }

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
  inputMobile(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  inputPincode(event: any) {
    if (
      event.key.length === 1 &&
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
      this.invalidPincode = true;
    }

    else {
      this.invalidPincode = false;
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
