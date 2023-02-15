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
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.less'],
})
export class AddNewComponent implements OnInit {
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
  ) { }
  profilePic: any;
  getBase64 = (file: any): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profilePic = reader.result as string;

        resolve(reader.result as string);
      };
      reader.onerror = (error) => reject(error);
    });

  uploadProfile() { }
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
    console.log(users);
    const userId = await this.authService.getUserRegisterToken(
      users.access_token
    );

    const studentPayload = {
      full_name_en: this.validateForm.value.fullName,
      full_name_kh: this.validateForm.value.fullNamekh,
      sex: this.validateForm.value.gender,
      date_of_birth: this.validateForm.value.dateOfBirth,
      place_of_birth: this.validateForm.value.placeOfBirth,
      telegram_username: this.validateForm.value.telegramUsername,
      address: this.validateForm.value.address,
      phone_number: this.validateForm.value.phoneNumber,
      email: this.validateForm.value.email,
      class_id: this.validateForm.value.class,
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
  async getAllClassroom(): Promise<void> {
    try {
      const response = await lastValueFrom(this.classService.getAllClass());
      console.log(response);
      this.classData = response;
    } catch (err) {
      this.message.error('One or more fields are required');
    }
  }
  ngOnInit(): void {

    this.getAllClassroom();
    this.validateForm = this.fb.group({
      email: [
        null,
        [Validators.compose([Validators.required, Validators.email])],
      ],
      password: [null, [Validators.compose([Validators.required])]],
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
