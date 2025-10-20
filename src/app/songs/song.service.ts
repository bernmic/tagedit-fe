import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {SongList} from './song.model';

@Injectable({
  providedIn: "root",
})
export class SongsService {
  private readonly http: HttpClient = inject(HttpClient);

  getSongList(parent: string): Observable<SongList> {
    return this.http.get<SongList>(environment.apiUrl + "/songs?parent=" + encodeURI(parent));
  }
}
