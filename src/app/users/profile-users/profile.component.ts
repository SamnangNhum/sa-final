import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'edit-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
})
export class ProfileComponent implements OnInit {
  isLoading: boolean = true;
  isUploading: boolean = false;
  validateForm!: FormGroup;
  fileList: NzUploadFile[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private classService: ClassService,
    private message: NzMessageService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}
  profilePic: any;
  getBase64 = (file: any): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profilePic = reader.result as string;
        console.log(this.profilePic);
        resolve(reader.result as string);
      };
      reader.onerror = (error) => reject(error);
    });

  uploadProfile() {}
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    this.getBase64(this.fileList[0]);
    return false;
  };

  removeProfile = (file: NzUploadFile): boolean => {
    this.profilePic = '';
    this.fileList = [];
    return false;
  };

  async submitForm(e: Event): Promise<void> {
    e.preventDefault();
    this.isUploading = true;
    const userPayload = {
      email: this.validateForm.value.email,
      password: this.validateForm.value.password,
      role: this.validateForm.value.role,
    };
    let users: any = [];
    try {
      const user = await lastValueFrom(
        this.authService.registerUser(userPayload)
      );
      users = user;
    } catch (err) {
      this.message.error('Invalid Email or Password');
      return;
    }


    const userId = await this.authService.getUserRegisterToken(
      users.access_token
    );

    const studentPayload = {
      full_name_en: this.validateForm.value.fullName,
      full_name_kh: this.validateForm.value.fullNamekh,
      sex: this.validateForm.value.gender,
      date_of_birth: this.validateForm.value.dateOfBirth,
      address: this.validateForm.value.address,
      phone_number: this.validateForm.value.phoneNumber,
      email: this.validateForm.value.email,
      student_id: this.validateForm.value.student,
      user_id: userId.sub,
    };

    let student: any = [];
    try {
      const response = await lastValueFrom(
        this.authService.registerStudent(studentPayload)
      );
      student = response;
    } catch (err) {
      this.message.error('One or more fields are required');
      return;
    }

    try {
      const formData: any = new FormData();
      await formData.append(
        'file',
        this.fileList[0],
        this.fileList[0].filename
      );
      await formData.append('student_id', student.id);
      await lastValueFrom(this.http.post('/profile', formData));
    } catch (err) {
      this.isUploading = false;

      return;
    }
    this.message.success('Successfully registered');
    this.isUploading = false;
  }
  classData: any = [];
  async getAllClass(): Promise<void> {
    try {
      const response = await lastValueFrom(this.classService.getAllClass());
   
      this.classData = response;
    } catch (err) {
      this.message.error('One or more fields are required');
    }
  }
  getCurrentUser(){
    
    this.authService.getCurrentUser().subscribe((data)=>{
      this.http.get('/profile/' + data.student.profile.id,{responseType: 'blob'}).subscribe((response)=>{
        this.getBase64(response);

      })
      console.log(data);
      this.validateForm.setValue({
        email:data.email,
       
        fullName:data.student.full_name_en,
        fullNamekh:data.student.full_name_kh,
        gender:data.student.sex,
        dateOfBirth:data.student.date_of_birth,
        placeOfBirth:data.student.place_of_birth,
        address:data.student.address,
        phoneNumber:data.student.phone_number,
        telegramUsername:data.student.telegram_username,
        role:data.role,
        class:data.student.class.id

      })
    })
  }
  ngOnInit(): void {
    this.getCurrentUser()
    this.getAllClass();
    this.validateForm = this.fb.group({
      email: [
        null,
        [Validators.compose([Validators.required, Validators.email])],
      ],
    
      fullName: [null, [Validators.compose([Validators.required])]],
      fullNamekh: [null, [Validators.compose([Validators.required])]],
      gender: [null, [Validators.compose([Validators.required])]],
      dateOfBirth: [null, [Validators.compose([Validators.required])]],
      placeOfBirth: [null, [Validators.compose([Validators.required])]],
      address: [null, [Validators.compose([Validators.required])]],
      phoneNumber: [null, [Validators.compose([Validators.required])]],
      telegramUsername: [null, [Validators.compose([Validators.required])]],
      role: [null, [Validators.compose([Validators.required])]],
      class: [null, [Validators.compose([Validators.required])]],
    });
  }
}
