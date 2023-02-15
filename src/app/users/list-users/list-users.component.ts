import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { catchError, lastValueFrom, of, skip } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';
import { ClassService } from 'src/app/services/class.service';

export interface User {
  id: string;
  email: string;
  role: string;
  officer: string;
}
@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.less'],
})
export class ListUsersComponent implements OnInit {
  dataSet: any = [];
  // value true if every array contain 1 checked
  inputValue?: string;
  pageIndex: string = '0';
  isLoading: boolean = false;
  totalUser: number = 0;
  isVisible: boolean = false;
  editUser: boolean = false;
  userId:string = '';
  showModal(id:string): void {
    this.isVisible = true;
    this.editUser= true;
    this.userId = id
  }
  handleCancel(): void {
    this.isVisible = false;
  }

  onInput(event: Event) {
    this.isLoading = true;
    let value = (event.target as HTMLInputElement).value;
    this.http
      .get(`/user/search?query=${value}`)
      .pipe(
        catchError((err) => {
          return of(err);
        })
      )
      .subscribe((data) => {
        this.dataSet = [...data];
        this.isLoading = false;
      });
  }
  // Fire Select Button To display check box

 

  deleteMessage: string = 'Are you sure you want to delete this user?';
  okBtn: string = 'Ok';
  cancelBtn: string = 'Cancel';
  successText: string = 'User has been successfully';
  actionText: string = 'Deleting user...';
  id: string = '';
  deleteUser(userId: string, studentId: string) {
    this.modalService.confirm({
      nzTitle: this.deleteMessage,
      nzOkText: this.okBtn,
      nzCancelText: this.cancelBtn,
      nzCentered: true,
      nzOkLoading: this.isLoading,

      nzOnOk: async () => {
        console.log(this.id);
        try {
          await lastValueFrom(this.http.delete('/student/' + studentId));
        } catch (err) {
          this.message.error('Error Deleting Student');
        }
        try {
          await lastValueFrom(this.http.delete('/user/' + userId));
        } catch (err) {
          this.message.error('Error Deleting User');
        }

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


  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private modalService: NzModalService,
    private authService: AuthService,
    private classService: ClassService
  ) {}

  async getUserByClass(): Promise<void> {
    let currentUser: any = [];
    try {
  
      currentUser = await lastValueFrom(this.authService.getCurrentUser(localStorage.getItem('user_id') as string));
    } catch (err) {
      return;
    }
    console.log(currentUser);
    if (currentUser.role === 'ADMIN') {
      try {
        const response = await lastValueFrom(
          this.classService.getClassById(currentUser.student.class.id)
        );
        this.dataSet = [...response.student];
      
      } catch (err) {
        return;
      }
      return;
    }
    this.http
      .get(`/user/list`)
      .pipe(
        catchError((err) => {
          return of(err);
        })
      )
      .subscribe((data) => {
        this.totalUser = data.length;
        this.dataSet = data;
        console.log(this.dataSet)
      });
  }

  ngOnInit(): void {
    this.getUserByClass();
  }
}
