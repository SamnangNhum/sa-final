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
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser(localStorage.getItem('user_id') as string).pipe(catchError((err)=>{
      return of()
    })).subscribe((user)=>{
 
      this.users = user;
      console.log(this.users)
    })
  }

}
