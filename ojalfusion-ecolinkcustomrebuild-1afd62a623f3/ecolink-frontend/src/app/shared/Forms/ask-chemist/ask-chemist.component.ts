import {
  Component,
  Renderer2,
  AfterViewInit,
  ViewChild,
  ElementRef, OnInit
} from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router } from "@angular/router";
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { ApiServiceService } from 'src/app/Services/api-service.service';

@Component({
  selector: 'app-ask-chemist',
  templateUrl: './ask-chemist.component.html',
  styleUrls: ['./ask-chemist.component.scss']
})
export class AskChemistComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  userObj: any;
  invalidPostalCode = false;
  invalidUserEmail: string = '';
  resSignupMsg: string = '';
  resSignupMsgCheck: string = ' ';
  invalidMobile = false;
  invalidEmail: boolean = false;
  constructor(private __apiservice: ApiServiceService, private renderer: Renderer2, private scroller: ViewportScroller, private router: Router) { }

  ngOnInit(): void {
  }
  chemist_array: any = [
    {
      imgurl: "assets/Philosophy.jpg",
      heading: "Philosophy and Methodology",
      content: "We always seek multi-use over single use chemical solutions "
    },
    {
      imgurl: "assets/chemical_manufacturing.jpg",
      heading: "Manufacturing Case Studies",
      content: "Ecolink is especially proud of our work with the global mining sector"
    }
  ]
  chemistForm = new FormGroup({
    input_11: new FormControl('', Validators.required),
    textarea: new FormControl('', [Validators.required,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    firstname: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    lastname: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    country: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    state: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    city: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    zip: new FormControl('', Validators.required),
  }, { updateOn: 'blur' }
  );
  saveAskChemistDetail() {
    if (this.chemistForm.valid) {
      let data = this.chemistForm.value
      console.log(data);
      this.userObj = {
        first_name: data.firstname,
        last_name: data.lastname,
        email: data.email,
        type: "askchemist",
        phone: data.phone,
        address_1: data.address,
        country: data.country,
        state: data.state,
        city: data.city,
        zip: data.zip,
        input_1: data.input_11,
        input_2: data.textarea
      };
      this.__apiservice.submitFormDetail(this.userObj).subscribe((res: any) => {
        console.log(res);
        this.chemistForm.reset();
        // Remove validators after form submission
        Object.keys(this.chemistForm.controls).forEach(key => {
          this.chemistForm.controls[key].setErrors(null)
        });

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
      this.resSignupMsg = 'Please Fill all the Fields!';
      setTimeout(() => {
        this.resSignupMsg = '';
        }, 3000);
    }
  }
  ngAfterViewInit() { }
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  goToTop() {
    window.scrollTo(0, 0);
    this.scroller.scrollToAnchor("backToTop");
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
      this.invalidPostalCode = true;
    }

    else {
      this.invalidPostalCode = false;
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
