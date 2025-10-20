import {effect, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DirectoryList} from './directories.model';
import {environment} from '../../environments/environment';
import {LocalStorageService} from '../common/localstorage.service';

@Injectable({
  providedIn: "root",
})
export class DirectoriesService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
  public currentDir = signal("");

  constructor() {
    let d = this.localStorageService.get('currentDir');
    if (d)
      this.currentDir.set(d);
  }

  getDirectoryList(parent: string): Observable<DirectoryList> {
    this.currentDir.set(parent);
    return this.http.get<DirectoryList>(environment.apiUrl + "/directories?parent=" + encodeURI(parent));
  }
}
