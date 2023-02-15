import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-cat-docs',
  templateUrl: './cat-docs.component.html',
  styleUrls: ['./cat-docs.component.less'],
})
export class CatDocsComponent implements OnInit {
  validateForm!: FormGroup;
  validateFieldEdit!: FormGroup;

  isLoading: boolean = true;
  dataSet: any = [];
  isVisible = false;
  tableId: number = 0;

  submitUpdate(e: Event) {
    // e.preventDefault();
    this.isLoading = true;
    this.http
      .patch(`/document-category/${this.tableId}`, {
        name: this.validateFieldEdit.value.docCat,
      })
      .pipe(
        catchError((err) => {
          return of();
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.getAllDocuments();
      });
    this.isLoading = false;
    this.isVisible = false;
  }
  submitForm(e: Event) {
    e.preventDefault();
    this.isLoading = true;
    const docName = this.validateForm.value.docCat;
    this.http
      .post('/document-category', { name: docName })
      .pipe(
        catchError((err) => {
          return of();
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.getAllDocuments();
        this.isLoading = false;
      });
  }
  handleDelete(id: number) {
    let docId = id;

    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this category?',
      nzOkText: 'Okay',
      nzCancelText: 'Cancel',
      nzOkLoading: this.isLoading,

      nzOnOk: () => {
        this.isLoading = true;
        this.http

          .delete(`/document-category/${docId}`, {})
          .pipe(
            catchError((err) => {
              return of();
            })
          )
          .subscribe((data) => {
            console.log(data);
            this.getAllDocuments();
            this.isLoading = false;
          });
        const id = this.message.loading('Deleting....', {
          nzDuration: 2500,
        }).messageId;
        setTimeout(() => {
          this.message.remove(id);
          this.message.create('success', 'Successfully Delete Document');
        }, 2500);
      },
    });
  }
  showModal(id: number): void {
    this.isVisible = true;
    this.tableId = id;
    for (let i = 0; i < this.dataSet.length; i++) {
      if (this.dataSet[i].id === id) {
        this.validateFieldEdit.setValue({ docCat: this.dataSet[i].name });
      }
    }
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  onInput(e: Event): void {
    this.isLoading = true;
    let value = (e.target as HTMLInputElement).value;
  }
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private modalService: NzModalService,
    private message: NzMessageService
  ) {}
  getAllDocuments() {
    this.http
      .get('/document-category/list')
      .pipe(
        catchError((err) => {
          console.log(err);
          return of();
        })
      )
      .subscribe((data) => {
        this.dataSet = data;
        this.isLoading = false;
        console.log(this.dataSet);
      });
  }

  ngOnInit(): void {
    this.getAllDocuments();
    this.validateForm = this.fb.group({
      docCat: [
        null,
        [Validators.compose([Validators.required])],
      ],
    });
    this.validateFieldEdit = this.fb.group({
      docCat: [null, [Validators.compose([Validators.required])]],
    });
  }
}
