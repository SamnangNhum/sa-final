import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  validateUsername: string = 'Please input your username!';
  validatePassword: string = 'Please input your password!';
  isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private message: NzMessageService // private authService: AuthService
  ) {}

  async submitForm(e: Event) {
    e.preventDefault();
    this.isLoading = true;
    try {
      const response = await lastValueFrom(
        this.authService.loginProcess(
          this.validateForm.value.userName,
          this.validateForm.value.password
        )
      );
      
      if (response.status === 0) {
        this.message.error('Internal Server Error');
        this.isLoading = false;
        return;
      }

      if (response.status === 400 || response.status === 401) {
        this.message.error('Invalid Username or Password');
        this.validateForm.setValue({
          userName: '',
          password: '',
        });
        this.isLoading = false;
        return;
      }

      this.message.success('Logged in successfully');
      window.localStorage.setItem('token', response.access_token.toString());
      window.localStorage.setItem(
        'refreshToken',
        response.refresh_token.toString()
      );
      window.localStorage.setItem(
        'user_id',
        this.authService.HasAccess().sub.toString()
      );
      window.localStorage.setItem(
        'user_role',
        this.authService.HasAccess().role.toString()
      );
      console.log(localStorage.getItem('token'));
      this.router.navigate(['']);
    } catch (err: any) {
      this.message.error('Invalid Username or Password');
      this.isLoading = false;
    }
  }

  ngOnInit(): void {
    localStorage.clear();
    this.validateForm = this.fb.group({
      userName: [null, [Validators.compose([Validators.required])]],
      password: [
        null,
        Validators.compose([Validators.required, Validators.minLength(4)]),
      ],
      remember: true,
    });
  }
}
