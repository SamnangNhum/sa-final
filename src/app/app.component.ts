import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { en_US, NzI18nService } from 'ng-zorro-antd/i18n';
import { lastValueFrom, Observable, of } from 'rxjs';
import { AuthService } from './services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  isCollapsed: boolean = false;
  router: any;
  isAdminMenu: boolean = false;

  openMap: { [name: string]: boolean } = {
    sub1: false,
    sub2: false,
  };

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }
  constructor(
    router: Router,
    private i18n: NzI18nService,
    private authService: AuthService
  ) {
    this.router = router;
    router.events.subscribe(async () => {
      const response = await lastValueFrom(this.authService.getUserId());
      if (response.role === 'USER') {
        this.isAdmin = of(false);
 
        return;
      }
      this.isAdmin = of(true);
    });
  }
  isAdmin: Observable<boolean | null> = of(null);
  async ngOnInit(): Promise<void> {
    this.i18n.setLocale(en_US);
  }
}
