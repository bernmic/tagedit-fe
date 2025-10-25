import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

export class SysInfo {
  constructor(
    public version: string,
    public commit_time: string,
    public os: string,
    public go_version: string,
    public library_path: string,
  ){}
}

@Injectable({
  providedIn: "root",
})
export class SysInfoService {
  private readonly http: HttpClient = inject(HttpClient);
  getSysInfo(): Observable<SysInfo> {
    return this.http.get<SysInfo>(environment.apiUrl);
  }
}
