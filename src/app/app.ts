import {Component, inject, signal} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {CommonModule} from '@angular/common';
import {ThemeService} from './common/theme.service';
import {Directories} from './directories/directories';
import {SysInfo, SysInfoService} from './common/sysinfo.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterOutlet,
    Directories,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('TagEdit');
  private readonly themeService = inject(ThemeService);
  private readonly sysInfoService: SysInfoService = inject(SysInfoService);
  private readonly router = inject(Router);
  protected sysInfo: SysInfo | undefined = undefined
  ;
  ngOnInit(): void {
    this.themeService.darkMode = window.matchMedia('(prefers-color-scheme)').matches;
    this.setColorMode();
    this.sysInfoService.getSysInfo().subscribe(si => {this.sysInfo = si;});
  }

  setColorMode() {
    console.log("darkMode=" + this.themeService.darkMode)
    if (this.themeService.darkMode) {
      document.body.classList.add("darkMode");
    } else {
      document.body.classList.remove("darkMode");
    }
  }

  toggleTheme() {
    this.themeService.darkMode = !this.themeService.darkMode;
    this.setColorMode();
  }
}
