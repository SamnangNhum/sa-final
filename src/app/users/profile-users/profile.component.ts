import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { profile } from 'console';
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
export class ProfileComponent implements OnInit, OnChanges {
  @Input() editUser: boolean = false;
  @Input() userId: string = '';
  isLoading: boolean = true;
  isUploading: boolean = false;
  validateForm!: FormGroup;
  fileList: NzUploadFile[] = [];
  ngOnChanges(changes: SimpleChanges) {
    this.editUser = this.editUser;
    this.userId = this.userId;
  }
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private classService: ClassService,
    private message: NzMessageService,
    private http: HttpClient
  ) {}
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

  uploadProfile() {}
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    console.log(this.fileList.length);
    this.getBase64(this.fileList[0]);
    return false;
  };

  removeProfile = (file: NzUploadFile): boolean => {
    this.profilePic = '';
    this.fileList = [];
    return false;
  };
  users: any = [];
  async submitForm(e: Event): Promise<void> {
    e.preventDefault();
    this.isUploading = true;

    const studentPayload = {
      full_name_en: this.validateForm.value.fullName,
      full_name_kh: this.validateForm.value.fullNamekh,
      sex: this.validateForm.value.gender,
      date_of_birth: this.validateForm.value.dateOfBirth,
      address: this.validateForm.value.address,
      phone_number: this.validateForm.value.phoneNumber,
      email: this.validateForm.value.email,
      student_id: this.validateForm.value.student,
      user_id: this.users.id,
    };

    try {
      await lastValueFrom(
        this.authService.updateStudentProfile(
          studentPayload,
          this.users.student.id
        )
      );
    } catch (err) {
      this.message.error('One or more fields are required');
      return;
    }

    if (this.fileList.length > 0 || this.profilePic === '') {
      console.log(this.users.student.profile.id);
      try {
        await lastValueFrom(
          this.http.delete('/profile/' + this.users.student.profile.id)
        );
      } catch (err) {
        this.message.error('Failed to update Profile');
        return;
      }
    }

    try {
      const formData: any = new FormData();
      await formData.append(
        'file',
        this.fileList[0],
        this.fileList[0].filename
      );
      await formData.append('student_id', this.users.student.id);
      await lastValueFrom(this.http.post('/profile', formData));
    } catch (err) {
      console.log(err);
      this.isUploading = false;

      return;
    }
    this.getCurrentUser();
    this.isUploading = true;

    this.message.success('Successfully update');
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
  getCurrentUser() {
    let id: string = '';
    if (this.editUser) {
      id = this.userId;
    } else {
      id = localStorage.getItem('user_id') as string;
    }
    this.authService.getCurrentUser(id).subscribe((data) => {
      this.users = data;
      if (data.student.profile !== null) {
        this.http
          .get('/profile/' + data.student.profile.id, { responseType: 'blob' })
          .subscribe((response) => {
            this.getBase64(response);
          });
      }

      console.log(data);
      this.validateForm.setValue({
        email: data.email,

        fullName: data.student.full_name_en,
        fullNamekh: data.student.full_name_kh,
        gender: data.student.sex,
        dateOfBirth: data.student.date_of_birth,
        placeOfBirth: data.student.place_of_birth,
        address: data.student.address,
        phoneNumber: data.student.phone_number,
        telegramUsername: data.student.telegram_username,
        role: data.role,
        class: data.student.class.id,
      });
    });
  }
  ngOnInit(): void {
    this.getCurrentUser();
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
