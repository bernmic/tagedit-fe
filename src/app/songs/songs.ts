import {Component, effect, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {SongsService} from './song.service';
import {Song, SongList} from './song.model';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {ThemeService} from '../common/theme.service';
import {CommonModule} from '@angular/common';
import {DirectoriesService} from '../directories/directories.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SelectionModel} from '@angular/cdk/collections';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LocalStorageService} from '../common/localstorage.service';
import {MatSort, MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-songs',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatSortModule,
    MatTableModule,
    MatToolbar,
    MatTooltipModule,
  ],
  templateUrl: './songs.html',
  styleUrl: './songs.scss'
})
export class Songs implements OnInit {
  protected readonly themeService: ThemeService = inject(ThemeService);
  private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
  private readonly songsService: SongsService = inject(SongsService);
  protected readonly directoriesService: DirectoriesService = inject(DirectoriesService);
  protected songList: SongList = new SongList([], 0);
  protected displayedColumns: string[] = ["select", "file", "title", "artist", "album", "track", "genre", "year"];
  protected dataSource = new MatTableDataSource<Song>(this.songList.songs);
  protected selection = new SelectionModel<Song>(true, []);
  @ViewChild(MatSort) sort: MatSort = new MatSort();

  constructor() {
    effect(() => {
      this.fetchSongs();
      this.localStorageService.set("currentDir", this.directoriesService.currentDir());
    });
  }

  ngOnInit(): void {
    let c = this.localStorageService.get('currentDir');
    if (c)
      this.directoriesService.currentDir.set(c);
    this.fetchSongs();
  }

  fetchSongs(): void {
    this.songsService.getSongList(this.directoriesService.currentDir()).subscribe(sl => {
      this.songList = sl;
      this.dataSource = new MatTableDataSource(this.songList.songs);
      this.selection = new SelectionModel<Song>(true, []);
      this.dataSource.sort = this.sort;
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Song): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.track}`;
  }

  editFile(row?: Song) {
    console.log("Edit file " + row?.path);
  }

  editSelected(): void {
    this.selection.selected.forEach((item) => {
    })
  }

  numerateSelected(): void {
    let trackNo = 1;
    this.selection.selected.forEach((item) => {
      item.track = (""+trackNo++).padStart(2, '0');
      item.changed = true;
    })
  }

  uncommentSelected(): void {
    this.selection.selected.forEach((item) => {
      item.comment = "";
      item.changed = true;
    })
  }

  renameSelected(): void {
    this.selection.selected.forEach((item) => {
      // @ts-ignore
      let tpl = this.localStorageService.get('renameMask');
      if (tpl === null) {
        tpl = "{track} - {artist} - {title}";
      }
      tpl = tpl.replace("{track}", item.track.padStart(2, '0'));
      tpl = tpl.replace("{artist}", item.artist);
      tpl = tpl.replace("{album}", item.album);
      tpl = tpl.replace("{title}", item.title);
      tpl = tpl.replace("{title}", item.title);
      tpl = tpl.replace("{year}", item.year);
      let path = item.path.substring(0, item.path.lastIndexOf("/"));
      let ext = item.path.substring(item.path.lastIndexOf("."));
      tpl = path + "/" + tpl + ext;
      item.changed = (tpl !== item.path);
      console.log(`${item.path} --> ${tpl} (changed=${item.changed})`);
      item.path = tpl;
    })
  }

  @HostListener('window:keydown.control.a', ['$event'])
  selectAll(event: Event) {
    event.preventDefault();
    this.selection = new SelectionModel<Song>(true, this.songList.songs);
  }
}
