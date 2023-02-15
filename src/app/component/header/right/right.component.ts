import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.less']
})
export class RightComponent implements OnInit {
  isVisible: boolean = false;
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
  }

}
