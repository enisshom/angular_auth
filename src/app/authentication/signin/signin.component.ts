import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { LoginService } from 'src/app/core/service/login.service';
import { DataToken } from 'src/app/core/models/data-token';
import { Buffer } from 'buffer';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  loginForm: FormGroup;
  submitted = false;
  error = '';
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,

    private activatedRoute: ActivatedRoute
  ) {
    super();
    localStorage.removeItem('e');
    localStorage.removeItem('date_now');
  }

  ngOnInit() {
    localStorage.removeItem('e');
    localStorage.removeItem('date_now');

    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)]
      ],
      password: ['', Validators.required]
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.loginForm.get('email').setValue(params.email);
    });
  }

  get f() {
    return this.loginForm.controls;
  }
  loading: Boolean = false;
  onSubmit() {
    this.submitted = false;
    this.error = '';
    let redirection_url: string = '/dashboard/planning';
    let loggedUser: any;

    if (this.loginForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      // this.loading = true;
      // this.subs.sink = this.loginService.login(this.f.email.value, this.f.password.value).subscribe({
      //   next: (res) => {
      //     console.log(res)
      //     this.loading = false;
      //     localStorage.removeItem("e")
      //     localStorage.removeItem("date_now");

      //     if (res) {
      //       //save token in local storage

      //       this.loginService.saveToken(res);
      //       let user: DataToken = this.loginService.getData(this.loginService.getAccessToken());
      //       localStorage.setItem("date_format", res.iat);

      //       this.router.navigate([redirection_url]);
      //     } else {
      //       this.error = 'Invalid Login';
      //     }
      //   },
      //   error: (error) => {
      //     this.loading = false;
      //     this.loginService.logout();
      //     this.f.password.setValue('');
      //     this.error = 'Username and Password not valid !';
      //     this.submitted = false;
      //   }
      // });
      this.router.navigate([redirection_url]);
    }
  }
}
