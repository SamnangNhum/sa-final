import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.less']
})
export class RightComponent implements OnInit {
  isVisible: boolean = false;
  users: any = [];
  profilePic:string = '';

  getBase64 = (file: any): Promise<string | ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profilePic = reader.result as string;
       reader.result as string;
        resolve(reader.result as string);
      };
      reader.onerror = (error) => reject(error);
    });
  showEditProfile(){
    this.isVisible = true;
  }
  handleCancel(){
    this.isVisible = false;
  }
  notiList = [
    { 
      "name" : "You have notifcation 1",
      "date" : "30-12-2023"
    },
    { 
      "name" : "You have notifcation 2",
      "date" : "30-12-2023"
    },
    { 
      "name" : "You have notifcation 3",
      "date" : "30-12-2023"
    }
  ]

  logout(){
    this.authService.logout();
  }
  constructor(private authService: AuthService,private http: HttpClient) { }

  ngOnInit(): void {
    this.authService.getCurrentUser(localStorage.getItem('user_id') as string).pipe(catchError((err)=>{
      return of()
    })).subscribe((user)=>{
      if (user.student.profile !== null) {
        this.http
          .get('/profile/' + user.student.profile.id, { responseType: 'blob' })
          .subscribe((response) => {
            this.getBase64(response);
          });
      }
      this.users = user;
    })
  }

}
