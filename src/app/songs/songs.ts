import {Component, effect, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {SongsService} from './song.service';
import {Song, SongChanges, SongList} from './song.model';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {ThemeService} from '../common/theme.service';
import {CommonModule} from '@angular/common';
import {DirectoriesService} from '../directories/directories.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SelectionModel} from '@angular/cdk/collections';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LocalStorageService} from '../common/localstorage.service';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {SongEditDialog} from '../dialogs/song-edit.dialog';
import {MatDialog} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {utils} from '../common/utils';
import {BreadcrumbComponent} from '../common/breadcrumb';
import {RenameDialog} from '../dialogs/rename.dialog';

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
    MatToolbarModule,
    MatTooltipModule,
    BreadcrumbComponent,
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
  protected displayedColumns: string[] = ["select", "file", "title", "artist", "album", "track", "genre", "year", "tags"];
  protected dataSource = new MatTableDataSource<Song>(this.songList.songs);
  protected selection = new SelectionModel<Song>(true, []);
  protected readonly dialog = inject(MatDialog);
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
  }

  fetchSongs(): void {
    this.songsService.getSongList(this.directoriesService.currentDir()).subscribe(sl => {
      this.songList = sl;
      sl.songs.forEach(song => {
        song.displayPath = this.extractFilename(song.path);
      });
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
    if (row === undefined)
      return;
    console.log("Edit file " + row?.path);
    this.openSongEditDialog(row);
  }

  editSelected(): void {
    this.selection.selected.forEach((item) => {
    })
  }

  numerateSelected(): void {
    this.dataSource.sortData(this.selection.selected, this.sort);
    let trackNo = 1;
    this.selection.selected.forEach((item) => {
      if (item.changes === null || item.changes === undefined) {
        item.changes = SongChanges.fromSong(item);
      }
      item.changes.track = (""+trackNo++).padStart(2, '0');
      item.changed = true;
    })
  }

  uncommentSelected(): void {
    this.selection.selected.forEach((item) => {
      if (item.comment !== "") {
        if (item.changes === null || item.changes === undefined) {
          item.changes = SongChanges.fromSong(item);
        }
        item.changes.comment = "";
        item.changed = true;
      }
    })
  }

  removeid3v1(): void {
    this.selection.selected.forEach((item) => {
      if (item.has_id3_v1) {
        item.remove_id3v1 = true;
        item.changed = true;
      }
    })
  }

  removeid3v2(): void {
    this.selection.selected.forEach((item) => {
      if (item.has_id3_v2) {
        item.remove_id3v2 = true;
        item.changed = true;
      }
    })
  }

  titlecaseFilenameSelected(): void {
    this.selection.selected.forEach((song) => {
      let newPath = this.capitalizeFilename(song.new_name ? song.new_name : song.path);
      if (newPath !== song.path) {
        song.new_name = newPath;
        song.displayPath = this.extractFilename(newPath);
        song.changed = true;
      }
    });
  }

  titlecaseSongSelected(): void {
    this.selection.selected.forEach((song) => {
      this.capitalizeSong(song);
    });
  }

  removeUnderscoreFilenameSelected(): void {
    this.selection.selected.forEach((song) => {
      let newPath = this.filenameRemoveUnderscores(song.new_name ? song.new_name : song.path);
      if (newPath !== song.path) {
        song.new_name = newPath;
        song.displayPath = this.extractFilename(newPath);
        song.changed = true;
      }
    });
  }

  openRenameDialog(): void {
    const dialogRef = this.dialog.open(RenameDialog, {
      data: {renamePattern: "%n - %a - %t", songs: this.selection.selected}, width: '50vw', maxWidth: '50vw'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log('The dialog was closed with result ');
        console.log(result);
      }
    });
  }

  openSongEditDialog(song: Song): void {
    const dialogRef = this.dialog.open(SongEditDialog, {
      data: {song: song}, width: '80vw', minWidth: '80vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log('The dialog was closed with result ');
        console.log(result);
      }
    });
  }

  compareSongs(song1: Song, song2: Song): boolean {
    return JSON.stringify(song1) === JSON.stringify(song2);
  }

  saveSongs(): void {
    this.songsService.updateSongList(this.songList).subscribe(() => {
      console.log('Successfully updated');
      // remove all changed flags
      this.songList.songs.forEach(song => {
        song.changed = false;
      });
    });
  }

  songTitle(song: Song): string {
    if (song.changes === null || song.changes === undefined) {
      return song.title;
    }
    return song.changes.titleChanged  ? song.changes.title! : song.title;
  }

  songYear(song: Song): string {
    if (song.changes === null || song.changes === undefined) {
      return song.year;
    }
    return song.changes.yearChanged  ? song.changes.year! : song.year;
  }

  @HostListener('window:keydown.control.a', ['$event'])
  selectAll(event: Event) {
    event.preventDefault();
    this.selection = new SelectionModel<Song>(true, this.songList.songs);
  }

  extractFilename = utils.extractFilename;
  removeFilename = utils.removeFilename;
  extractExtension = utils.extractExtension;
  pad = utils.pad;
  capitalizeFilename = utils.capitalizeFilename;
  capitalizeSong = utils.capitalizeSong;
  filenameRemoveUnderscores = utils.filenameRemoveUnderscores;
}
