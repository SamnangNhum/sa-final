import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import {  lastValueFrom,  } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';
import { DocsService } from 'src/app/services/docs.service';

export interface fileAttachment {
  name: string;
  path: string;
  mime_type: string;
  document_id: string;
}

@Component({
  selector: 'app-add-new-docs',
  templateUrl: './add-new-docs.component.html',
  styleUrls: ['./add-new-docs.component.less'],
})
export class AddNewDocsComponent implements OnInit {
  uploading = false;
  fileList: NzUploadFile[] = [];
  docType: any = [];
  docCategory: any = [];
  docSource: any = [];

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);

    return false;
  };

  validateForm!: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private msg: NzMessageService,
    private docsService: DocsService,
    private authService: AuthService
  ) {}
  async submitForm(e: Event): Promise<void> {
    e.preventDefault();
    this.uploading = true;
    let currentUser: any = []
    try {
      currentUser = await lastValueFrom(this.authService.getCurrentUser()) 
    }catch(err){
      return ;
    }
    console.log(currentUser)
    const docObj = {
      title: this.validateForm.value.docName,
      ref_number: this.validateForm.value.docRef,
      date_in: this.validateForm.value.date,
      document_type_id: this.validateForm.value.docType,
      source_id: this.validateForm.value.docSource,
      document_category_id: this.validateForm.value.docCategory,
      user_id: currentUser.id,
      class_id:currentUser.student.class_id
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
    if(currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN"){
      try {
        const response = await lastValueFrom(
          this.http.patch('/document/approve/' + docId, {is_approved:2})
        );
        console.log(response);
      } catch (e) {
       
        return;
      }
    }
    try {
      for (let i = 0; i < this.fileList.length; i++) {
        const formData: any = new FormData();
        await formData.append(
          'file',
          this.fileList[i],
          this.fileList[i].filename
        );
        await formData.append('document_id', docId);
        await lastValueFrom(this.http.post('/upload', formData));
      }
      this.fileList = [];
      this.msg.success('upload successfully.');
      this.uploading = false;
      this.validateForm.setValue({
        docRef: '',
        docName: '',
        docType: '',
        docCategory: '',
        docSource: '',
        docDate:'',
      })
      // if (this.validateForm.valid) {
      //   this.router.navigateByUrl('home');
      // }
    } catch (err) {
      this.msg.error('Error upload');
      return;
    }
  }
  

  inputCategoryValue(value:string){
    console.log(value);
    return value;
  }
  createCategory(){

  }
  noData:Boolean = false;
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      docRef: [null, [Validators.compose([Validators.required])]],
      docName: [null, [Validators.required]],
      docType: [null, [Validators.required]],
      docCategory: [null, [Validators.required]],
      docSource: [null, [Validators.required]],
      docDate: [null, Validators.required],
    });

    this.docsService.getAllDocType().subscribe((data) => {
      this.docType = data;
    
    });
    this.docsService.getAllDocSource().subscribe((data) => {
      this.docSource = data;
    });
    this.docsService.getAllDocCategory().subscribe((data) => {
      console.log(data);
      if(data.length == 0){
        this.noData = true;
        return ;
      }
      this.noData = false;
      this.docCategory = data;
      console.log(this.noData)
    });
  }
}
