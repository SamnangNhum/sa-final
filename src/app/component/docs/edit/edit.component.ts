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
import { throws } from 'assert';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { ListDocsComponent } from 'src/app/docs/list-docs/list-docs.component';
import { DocsService } from 'src/app/services/docs.service';

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
  @Input() dataShare: any;
  @Input() isView: boolean = false;
  uploadfileList: NzUploadFile[] = [];
  fileList: any[] = [];
  uploading = false;
  previewImage: any;
  imageUrl: string = '';
  isVisible: boolean = false;
  modalLoading: boolean = false;
  filePreview: string = '';
  fileBase64: string = '';

  getBase64 = (file: any): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.filePreview = reader.result as string;
        this.fileBase64 = reader.result as string;
        resolve(reader.result as string);
      };
      reader.onerror = (error) => reject(error);
    });

  async ngOnChanges(changes: SimpleChanges) {
    this.modalLoading = true;
    await this.dataShare;
    this.docType = await lastValueFrom(this.docsService.getAllDocType());
    this.docSource = await lastValueFrom(this.docsService.getAllDocSource());
    this.docCategory = await lastValueFrom(
      this.docsService.getAllDocCategory()
    );
   
    console.log(this.dataShare.createdAt);
    const docDate = new Date(this.dataShare.createdAt);
    for (let i = 0; i < this.dataShare.attachment.length; i++) {
      this.fileList.push(this.dataShare.attachment[i]);
      console.log(this.fileList)
      this.fileList[i].canView = true;
      if (
        this.dataShare.attachment[i].mime_type === 'application/pdf' ||
        this.dataShare.attachment[i].mime_type === 'image/png' ||
        this.dataShare.attachment[i].mime_type === 'image/jpg' ||
        this.dataShare.attachment[i].mime_type === 'image/jpeg'
      ) {
        this.fileList[i].canView = true;
      } else {
        this.fileList[i].canView = false;
      }
    }

    this.validateForm.setValue({
      docRef: this.dataShare.ref_number,
      docName: this.dataShare.title,
      docType:
        this.dataShare.document_type !== null
          ? this.dataShare.document_type.id
          : '',
      docSource: this.dataShare.source !== null ? this.dataShare.source.id : '',
      docCategory:
        this.dataShare.document_category !== null
          ? this.dataShare.document_category.id
          : '',
      docDate: docDate,
    });
    if (this.isView === true) {
      this.validateForm.controls['docRef'].disable();
      this.validateForm.controls['docName'].disable();
      this.validateForm.controls['docType'].disable();
      this.validateForm.controls['docSource'].disable();
      this.validateForm.controls['docCategory'].disable();
      this.validateForm.controls['docDate'].disable();
    }

    this.modalLoading = false;
  }
  isImage: boolean = true;

  showImage(id: string) {
    this.isVisible = true;
    this.docsService.getAttachMent(id).subscribe((response) => {
      const contentType = response.headers.get('Content-Type');
      if (contentType === 'application/pdf') {
        this.isImage = false;
      } else {
        this.isImage = true;
      }
      this.getBase64(response.body);
    });
  }
  downloadFile(id: string) {
    this.docsService.downloadDoc(id);
  }
  deleteMessage: string = 'Are you sure you want to delete this file?';
  okBtn: string = 'Ok';
  cancelBtn: string = 'Cancel';
  successText: string = 'file has been successfully';
  actionText: string = 'Deleting file...';
  id: string = '';
  deleteDoc(id: string) {
    this.id = id;
    this.modalService.confirm({
      nzTitle: this.deleteMessage,
      nzOkText: this.okBtn,
      nzCancelText: this.cancelBtn,
      nzCentered: true,
      nzOnOk: async () => {
        try {
          await lastValueFrom(
            this.http.delete('/upload/' + this.id).pipe(
              catchError((err) => {
                return of(err);
              })
            )
          );
        } catch (err) {
          return;
        }

        const id = this.message.loading(this.actionText, {
          nzDuration: 0,
        }).messageId;
        setTimeout(() => {
          this.message.remove(id);
          this.message.create('success', this.successText);
        }, 0);
        this.docsService
          .getDocsById(this.dataShare.id)
          .pipe(
            catchError((err) => {
              return of(err);
            })
          )
          .subscribe((data) => {
            this.fileList = [];
            if (data.attachment != null) {
              for (let i = 0; i < data.attachment.length; i++) {
                if (
                  data.attachment[i].mime_type === 'application/pdf' ||
                  data.attachment[i].mime_type === 'image/png' ||
                  data.attachment[i].mime_type === 'image/jpg' ||
                  data.attachment[i].mime_type === 'image/jpeg'
                ) {
                  data.attachment[i].canView = true;
                } else {
                  data.attachment[i].canView = false;
                }
                this.fileList = [...data.attachment];
              }
            }
          });
      },
    });
  }
  handleCancel() {
    this.isVisible = false;
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.uploadfileList = this.uploadfileList.concat(file);
    return false;
  };

  validateForm!: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService,
    private docForm: ListDocsComponent,
    private docsService: DocsService,
    private modalService: NzModalService
  ) {}
  async submitForm(e: Event): Promise<void> {
    e.preventDefault();
    this.uploading = true;

    const docObj = {
      title: this.validateForm.value.docName,
      ref_number: this.validateForm.value.docRef,
      date_in: this.validateForm.value.date,
      document_type_id: this.validateForm.value.docType,
      source_id: this.validateForm.value.docSource,
      document_category_id: this.validateForm.value.docCategory,
      user_id: localStorage.getItem('user_id'),
    };

    try {
      await lastValueFrom(
        this.http.patch('/document/' + this.dataShare.id, docObj)
      );
    } catch (e) {
      return;
    }

    for (let i = 0; i < this.uploadfileList.length; i++) {
      const formData: any = new FormData();

      await formData.append(
        'file',
        this.uploadfileList[i],
        this.uploadfileList[i].filename
      );
      await formData.append('document_id', this.dataShare.id);
      await lastValueFrom(this.docsService.uploadAttachment(formData));
    }
    this.message.success('upload successfully.');
    this.modalService.closeAll();

    this.uploading = false;
    window.location.reload();
  }

  docType: any = [];
  docSource: any = [];
  docCategory: any = [];
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      docRef: [null, [Validators.compose([Validators.required])]],
      docName: [null, [Validators.required]],
      docType: [null, [Validators.required]],
      docCategory: [null, [Validators.required]],
      docSource: [null, [Validators.required]],
      docDate: [null, Validators.required],
    });
  }
}
