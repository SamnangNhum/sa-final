import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { AuthService } from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService){}
  
  canActivate(){
    console.log(this.authService.HasAccess().role);
    if(this.authService.HasAccess().role === "SUPER_ADMIN"){
      return true;
    }
    return false
  }
  
}
  