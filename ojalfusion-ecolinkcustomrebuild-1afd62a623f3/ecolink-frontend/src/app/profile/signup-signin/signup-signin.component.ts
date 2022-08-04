import { Component, Renderer2, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/Services/api-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup-signin',
  templateUrl: './signup-signin.component.html',
  styleUrls: ['./signup-signin.component.scss']
})
export class SignupSigninComponent implements OnInit {
  @ViewChild('test') test: ElementRef | any;
  adminurl = environment.adminurl;
  userObj: any;
  taxCalculate: any
  radiocheck: boolean = true;
  loginobj: any;
  resSignupMsg: string = '';
  password: string = '';
  confirmPassword: string = '';
  invalidMobile = false;
  invalidPincode = false;
  fromcheckoutdetail:any={}
  invalidEmail: boolean = false;
  invalidUserEmail: string = '';
  checkString: boolean = true;
  resSignupMsgCheck: string = ' ';
  resSignInMsgCheck: string = ' ';
  resSignInMsg: string = ' ';
  resMsg: string = '';
  invalidZip = false;
  errMsg = [];
  constructor(private router: Router, private renderer: Renderer2, private scroller: ViewportScroller, private __apiservice: ApiServiceService) { }

  ngOnInit(): void {
    if(localStorage.getItem('ecolink_user_credential')==null) {
      this.__apiservice.nonloginuserdetail.subscribe((res:any)=> {
        console.log(res);
        if(res.string) {
          this.fromcheckoutdetail=res;
          console.log(this.checkString)
          this.checkString=false;
        }
      })
    }
  }
  clickonradio() {
    this.radiocheck = false;
  }
  // showing sign in modal
  SignIn() {
    this.checkString = !this.checkString;
  }
  // validate pincode 
  inputZip(event: any) {
    if (
      event.key.length === 1 &&
      !/^[0-9]$/.test(event.key)
    ) {
      event.preventDefault();
    }
  }
  validateZip(event: any) {
    const value = event.target.value;
    if (
      value &&
      /^[0-9]+$/.test(value) &&
      value.length < 5
    ) {
      this.invalidZip = true;
    }
    else {
      this.invalidZip = false;
    }
  }
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
  //go to top when pop up opens
  goToTop() {
    window.scrollTo(0, 0);
    this.scroller.scrollToAnchor("backToTop");
  }
  //validate user mobile number
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
  //get user form details
  profileForm = new FormGroup({
    firstname: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    // lastname: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
    email: new FormControl('', [Validators.required]),
    phonenumber: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmpassword: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    landmark: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    country: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    state: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    city: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/)]),
    pincode: new FormControl('', [Validators.required]),
    radio2: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required,])
  }, { updateOn: 'blur' }
  );
  //user sign up 
  signUp() {
    if (this.profileForm.valid) {
      this.resSignupMsgCheck = 'warning';
      this.resSignupMsg = 'Wait for a while....'

      let data = this.profileForm.value;
      console.log(data);
      let formData = new FormData();
      formData.append('profile_image', this.file);
      formData.append('name', data.firstname);
      formData.append('email', data.email);
      formData.append('mobile', data.phonenumber);
      formData.append('password', data.password);
      formData.append('landmark', data.landmark);
      formData.append('address', data.address);
      formData.append('country', data.country);
      formData.append('state', data.state);
      formData.append('city', data.city);
      formData.append('pincode', data.pincode);
      formData.append('tax_exempt', data.radio2);
      this.taxCalculate = data.radio2
      this.__apiservice.post(formData).subscribe(
        (res) => {
          console.log(res);
          if (res.code == 200) {
            if (res.data.user.remember_token) {
              this.resSignupMsgCheck = 'success';
              this.resSignupMsg = 'Verification mail has been sent to your Email Id !'
            }
            localStorage.setItem(
              'ecolink_user_credential',
              JSON.stringify(res.data)
            );
            //Reset the form affter submition
            this.profileForm.reset();
            // Remove validators after form submission
            Object.keys(this.profileForm.controls).forEach(key => {
              this.profileForm.controls[key].setErrors(null)
            });
          }

          else {
            this.resSignupMsg = res.message;
            localStorage.removeItem('ecolink_user_credential');
          }
        },
        (error: HttpErrorResponse) => {
          console.log(error.status);
          console.log(error);
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
            this.resSignupMsgCheck = 'danger';
          }
          else if(error.status == 422) {
            console.log(error.error.errors.profile_image[0]);
            this.resSignupMsg = error.error.errors.profile_image[0];
            this.resSignupMsgCheck = 'danger';
          }
          else if(error.status == 500) {
            this.resSignupMsgCheck = 'danger',
            this.resSignupMsg = 'Something Went Wrong!'
          }
        });
    }
    else {
      this.resSignupMsg = "Please Fill all the Fields!"
      this.resSignupMsgCheck = "danger"
      setTimeout(() => {
        this.resSignupMsg = ' ';
        this.resSignupMsgCheck = ' ';
      }, 3000);
    }
  }
  //user sign in 
  signinWithEmail(form: NgForm) {
    if (form.valid) {
      let data = Object.assign({}, form.value);
      this.loginobj = {
        email: data.emailphone,
        password: data.password,
      };
      console.log(this.loginobj);

      this.__apiservice.login(this.loginobj).subscribe(
        (res) => {
          console.log(res);
            if (res.user_type === "admin") {
              console.log(res.user_type);
              console.log(this.adminurl , res.redirect_url)
              window.location.href = res.redirect_url;
            }
            else {
            localStorage.setItem(
              'ecolink_user_credential',
              JSON.stringify(res.data)
            );
            localStorage.setItem('string','existinguser');
            this.router.navigateByUrl('/');
          }
          // else {
          //   this.resMsg = res.error;
          //   console.log(this.resMsg = res.error);
          //   localStorage.removeItem('ecolink_user_credential');
          // }
        },
        (error: HttpErrorResponse) => {
          if(error.error.message=="Please enter correct password") {
            console.log(error);
            this.resSignInMsgCheck = 'danger';
            this.resSignInMsg = 'Incorrect Username Password!';
            setTimeout(() => {
              this.resSignInMsgCheck = ' ';
              this.resSignInMsg = ' ';
            }, 3000);
            console.log(error.error.code);
            form.reset();
          }
          if(error.error.message=="User is Deactivated") {
            console.log(error);
            this.resSignInMsgCheck = 'danger';
            this.resSignInMsg = 'Your account is currently deactivated! Please contact us "info@ecolink.com"';
            // setTimeout(() => {
            //   this.resSignInMsgCheck = ' ';
            //   this.resSignInMsg = ' ';
            // }, 3000);
            console.log(error.error.code);
            form.reset();
          }
          if(error.error.message=="User not found or inactive") {
            console.log(error);
            this.resSignInMsgCheck = 'danger';
            this.resSignInMsg = 'User Not Found!';
            setTimeout(() => {
              this.resSignInMsgCheck = '';
              this.resSignInMsg = '';
            }, 3000);
            console.log(error.error.code);
            form.reset();
          }
        }
      );

      () => {
        form.reset();
      }
    }
    else {
      this.resSignInMsg = "Please Fill The Value!"
      this.resSignInMsgCheck = "danger"
      setTimeout(() => {
        this.resSignInMsg = ' ';
        this.resSignInMsgCheck = ' ';
      }, 3000);
    }
  }
  //close pop up
  close() {
    this.renderer.setStyle(this.test.nativeElement, 'display', 'none');
    this.resSignupMsg = '';
  }
  //get profile image and validate
  file: any = null;
  fileUrl: any;
  max_error_front_img: string = '';
  GetFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size < 2000000) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.fileUrl = e.target.result;
        reader.readAsDataURL(event.target.files[0]);
        this.file = event.target.files[0];
        this.max_error_front_img = "";
      } else {
        this.max_error_front_img = "Max file upload size to 2MB";
        this.fileUrl = 'https://breakthrough.org/wp-content/uploads/2018/10/default-placeholder-image.png';
        this.file = null;
      }
    }
  }
  // signInWithGoogle(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
  //     (user: any) => {
  //       console.log("Loged In User", user);
  //       localStorage.setItem('Access_token',user.authToken);
  //       // this._utilityService.setObject(user, 'GoogleOAuth_USER')
  //       // this.dataService.loginedUserSubject.next(user);
  //       window.history.back();
  //     }
  //   );
  // }
}
