import {Component, effect, inject} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {DirectoriesService} from './directories.service';
import {DirectoryList} from './directories.model';

@Component({
  selector: 'app-directories',
  imports: [
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './directories.html',
  styleUrl: './directories.scss'
})
export class Directories {
  protected readonly directoriesService = inject(DirectoriesService)
  protected directoryList: DirectoryList = new DirectoryList([], 0);

  constructor() {
    effect(() => {
      this.fetchDirs();
    });
  }
  
  ngOnInit(): void {
    this.fetchDirs();
  }

  fetchDirs(): void {
    console.log("currentDir=" + this.directoriesService.currentDir());
    this.directoriesService.getDirectoryList(this.directoriesService.currentDir()).subscribe(dl => {
      this.directoryList = dl;
    });
  }

  dirClicked(dir: string) {
    let currentDir = this.directoriesService.currentDir();
    if (dir === "..") {
      if (currentDir !== "") {
        if (currentDir.includes("/")) {
          let p = currentDir.lastIndexOf("/");
          currentDir = currentDir.substring(0, p);
        } else {
          currentDir = "";
        }
      }
    } else {
      if (currentDir === "") {
        currentDir = dir;
      } else {
        currentDir = currentDir + "/" + dir;
      }
    }
    this.directoriesService.currentDir.set(currentDir);
    this.fetchDirs();
  }
}
