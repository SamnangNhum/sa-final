import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { catchError, last, lastValueFrom, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';
import { DocsService } from 'src/app/services/docs.service';
import { ClassService } from 'src/app/services/class.service';

@Component({
  selector: 'app-list-docs',
  templateUrl: './list-docs.component.html',
  styleUrls: ['./list-docs.component.less'],
})
export class ListDocsComponent implements OnInit {
  dataSet: any = [];
  isView: boolean = false;
  dataSharing: any = [];
  validateForm!: FormGroup;
  isVisible: boolean = false;
  isLoading: boolean = true;
  pageIndex: string = '0';
  totalDocs: number = 0;
  noData: boolean = false;
  isApproved: number = 1;
  async showModal(id: string): Promise<void> {
    const responseData = await lastValueFrom(this.docsService.getDocsById(id));
    this.dataSharing = await responseData;

    this.isView = false;
    this.isVisible = true;
  }

  async viewDocs(id: string): Promise<void> {
    console.log(id)
    const responseData = await lastValueFrom(this.docsService.getDocsById(id));
    this.dataSharing = await responseData;
    this.isView = true;
    this.isVisible = true;
    console.log(responseData);
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  pageIndexChange(index: any): void {
    console.log(index);
    this.isLoading = true;
    this.pageIndex = (index as string) + '0';
    let skipNumber = index - 1 + '0';
    this.http
      .get(`/user?take=${this.pageIndex}&skip=${skipNumber}`)
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(err);
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.dataSet = [...data];
        this.isLoading = false;
      });
  }

  deleteMessage: string = 'Are you sure you want to delete this document?';
  okBtn: string = 'Ok';
  cancelBtn: string = 'Cancel';
  successText: string = 'Document has been successfully';
  actionText: string = 'Deleting document...';
  id: string = '';

  deleteUser(id: string) {
    this.id = id;
    this.modalService.confirm({
      nzTitle: this.deleteMessage,
      nzOkText: this.okBtn,
      nzCancelText: this.cancelBtn,
      nzCentered: true,
      nzOkLoading: this.isLoading,

      nzOnOk: async () => {
        let dataDoc: any = [];
        try {
          const response = await lastValueFrom(
            this.http.get('/document/' + this.id).pipe(
              catchError((err) => {
                return of(err);
              })
            )
          );
          dataDoc = response;
          console.log(dataDoc);
        } catch (err) {
          return;
        }
        for (let i = 0; i < dataDoc.attachment.length; i++) {
          console.log(dataDoc.attachment[i]);
          try {
            await lastValueFrom(
              this.http.delete('/upload/' + dataDoc.attachment[i].id).pipe(
                catchError((err) => {
                  return of(err);
                })
              )
            );
          } catch (err) {
            return;
          }
        }

        try {
          await lastValueFrom(
            this.http.delete('/document/' + this.id).pipe(
              catchError((err) => {
                return of(err);
              })
            )
          );
        } catch (err) {}
        this.docsService.getAllDocs().subscribe((data) => {
          this.dataSet = data;
        });
        const id = this.message.loading(this.actionText, {
          nzDuration: 2500,
        }).messageId;
        setTimeout(() => {
          this.message.remove(id);
          this.message.create('success', this.successText);
        }, 2500);
      },
    });
  }

  submitForm(e: Event): void {} // value true if every array contain 1 checked
  inputValue?: string;
  onInput(event: Event) {
    this.isLoading = true;
    let value = (event.target as HTMLInputElement).value;
    this.docsService.searchDocs(value).subscribe((data) => {
      this.dataSet = [...data];
      this.isLoading = false;
    });
  }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private docsService: DocsService,
    private authService: AuthService,
    private classService: ClassService,
    private route: ActivatedRoute
  ) {}

  getAllDocuments(): void {}

  async getAllDocumentByclass() {
    let currentUser: any = [];
    try {
      currentUser = await lastValueFrom(this.authService.getCurrentUser());
    } catch (err) {
      return;
    }
    if (currentUser.role === 'ADMIN' || currentUser.role === 'USER') {
      try {
        const response = await lastValueFrom(
          this.classService.getClassById(currentUser.classr.class_id)
        );
          console.log(response)
        this.dataSet = [...response.document];
        if (currentUser.role === 'USER') {
          for (let i = 0; i < this.dataSet.length; i++) {
            if (this.dataSet[i].user.id === currentUser.id) {
              this.dataSet[i].access = false;
            } else {
              this.dataSet[i].access = true;
            }
          }
        }

        this.isLoading = false;
      } catch (err) {
        return;
      }
      return;
    }
    this.docsService.getAllDocs().subscribe((data) => {
      this.dataSet = data;
      this.totalDocs = data.length;
      this.isLoading = false;
    });
  }
  async acceptedDocs(id:string){
    console.log(id)
    try {
      const response = await lastValueFrom(
        this.http.patch('/document/approve/' + id, {is_approved:2})
      );
      console.log(response);
    } catch (e) {
     
      return;
    }
    this.getAllDocumentByclass()

  }
  
  role: boolean = false;
  currentUserId = localStorage.getItem('user_id');
  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap.get('isApproved'))
    this.route.params.subscribe((routeParam)=>{
      this.isApproved = +routeParam['isApproved'];
     
    })
    this.getAllDocumentByclass();

    this.validateForm = this.fb.group({
      docRef: [null, [Validators.compose([Validators.required])]],
      docName: [null, [Validators.required]],
      docType: [null, [Validators.required]],
      docSource: [null, [Validators.required]],
      docDate: [null, Validators.required],
      docCategory: [null, [Validators.required]],
    });
  }
}
