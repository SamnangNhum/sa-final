import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';

export interface fileAttachment {
  name: string;
  path: string;
  mime_type: string;
  document_id: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class EditComponent implements OnInit, OnChanges {
  uploading: boolean = false;
  @Input() isView: boolean = false;
  fileList: NzUploadFile[] = [];
  ngOnChanges(changes: SimpleChanges): void {}
  previewFile = (file: NzUploadFile): Observable<string> => {
    console.log('Your upload file:', file);
    return this.http
      .post<{ thumbnail: string }>(
        `https://next.json-generator.com/api/json/get/4ytyBoLK8`,
        {
          file,
        }
      )
      .pipe(map((res) => res.thumbnail));
  };

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };
  // if (status === 'done') {
  //   this.msg.success(`${file.name} file uploaded successfully.`);
  // } else if (status === 'error') {
  //   this.msg.error(`${file.name} file upload failed.`);

  validateForm!: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private msg: NzMessageService
  ) {}
  async submitForm(e: Event): Promise<void> {
    e.preventDefault();

    const docObj = {
      title: this.validateForm.value.docName,
      ref_number: this.validateForm.value.docRef,
      date_in: '1-4-2023',
      date_out: '1-10-2023',
      optional: 'optional',
    };
    let docId = '';
    try {
      const document: { id: string } = await lastValueFrom(
        this.http.post<{ id: string }>('/document', docObj)
      );
      docId = document.id;
    } catch (err) {
      console.log(err);
      return;
    }

    for (let i = 0; i < this.fileList.length; i++) {
      const formData: any = new FormData();

      await formData.append(
        'file',
        this.fileList[i],
        this.fileList[i].filename
      );
      this.http
        .post('/upload', formData)
        .pipe(
          catchError((err) => {
            return of();
          })
        )
        .subscribe((data) => {
          this.uploading = false;
          this.fileList = [];
          this.msg.success('upload successfully.');
          console.log(data);

          return data;
        });
    }
    this.uploading = true;
    if (this.validateForm.valid) {
      this.router.navigateByUrl('home');
    }
  }

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [
        null,
        [Validators.compose([Validators.required, Validators.email])],
      ],
      password: [null, [Validators.compose([Validators.required])]],
      firstName: [null, [Validators.compose([Validators.required])]],
      lastName: [null, [Validators.compose([Validators.required])]],
      firstNamekh: [null, [Validators.compose([Validators.required])]],
      lastNamekh: [null, [Validators.compose([Validators.required])]],
      gender: [null, [Validators.compose([Validators.required])]],
      dateOfBirth: [null, [Validators.compose([Validators.required])]],
      placeOfBirth: [null, [Validators.compose([Validators.required])]],
      address: [null, [Validators.compose([Validators.required])]],
      phoneNumber: [null, [Validators.compose([Validators.required])]],
      telegramUsername: [null, [Validators.compose([Validators.required])]],
      rank: [null, [Validators.compose([Validators.required])]],
      position: [null, [Validators.compose([Validators.required])]],
    });
  }
}
