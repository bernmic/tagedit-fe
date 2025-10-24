import {Component, effect, inject, Input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {DirectoriesService} from '../directories/directories.service';

@Component({
  selector: 'breadcrumb',
  templateUrl: 'breadcrumb.html',
  styleUrls: ['breadcrumb.scss'],
  imports: [
    MatButtonModule
  ]
})
export class BreadcrumbComponent {
  private directoriesService: DirectoriesService = inject(DirectoriesService);

  @Input({required: true}) items!: string;
  @Input({required: true}) divider!: string;
  protected crumbs: string[] = [];

  ngOnInit() {
    this.items.split(this.divider).forEach(item => this.crumbs.push(item));
  }

  onClick(idx: number) {
    console.log(`Clicking ${idx} with content ${this.crumbs[idx]}`);
    if (idx >= this.crumbs.length - 1)
      return;
    if (idx === - 1) {
      this.directoriesService.currentDir.set("");
      return
    }
    let i: number;
    let dir = ""
    for (i  = 0; i <= idx; i++) {
      dir += this.crumbs[idx][i] + "/";
    }
    this.directoriesService.currentDir.set(dir.slice(0, -1));
  }
}
