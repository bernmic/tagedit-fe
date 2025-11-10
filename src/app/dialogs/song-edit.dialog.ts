import {Component, inject, model, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Song, SongChanges} from '../songs/song.model';
import {utils} from '../common/utils';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import { DomSanitizer } from '@angular/platform-browser';
import {DurationPipe} from '../common/duration.pipe';

export interface SongData {
  song: Song;
}

@Component({
  selector: 'song-dialog',
  templateUrl: './song-edit.dialog.html',
  styleUrls: ['./song-edit.dialog.scss'],
  imports: [
    DurationPipe,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDividerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
  ],
})
export class SongEditDialog implements OnInit {
  readonly dialogRef = inject(MatDialogRef<SongEditDialog>);
  readonly data = inject<SongData>(MAT_DIALOG_DATA);
  readonly song = model(this.data.song);
  readonly sanitizer: DomSanitizer =  inject(DomSanitizer);
  protected cover: any;

  ngOnInit() {
    if (this.song().cover && this.song().cover.mime) {
      let objectURL = 'data:' + this.song().cover.mime + ';base64,' + this.song().cover.data;
      this.cover = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    } else {
      this.cover = undefined;
    }
    if (this.song().changes === null || this.song().changes === undefined) {
      this.song().changes = SongChanges.fromSong(this.song())
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    if (this.song().title !== this.song().changes!.title) {
      this.song().changes!.titleChanged = true;
      this.song().changed = true;
    }
    if (this.song().artist !== this.song().changes!.artist) {
      this.song().changes!.artistChanged = true;
      this.song().changed = true;
    }
    if (this.song().album !== this.song().changes!.album) {
      this.song().changes!.albumChanged = true;
      this.song().changed = true;
    }
    if (this.song().album_artist !== this.song().changes!.album_artist) {
      this.song().changes!.albumArtistChanged = true;
      this.song().changed = true;
    }
    if (this.song().track !== this.song().changes!.track) {
      this.song().changes!.trackChanged = true;
      this.song().changed = true;
    }
    if (this.song().genre !== this.song().changes!.genre) {
      this.song().changes!.genreChanged = true;
      this.song().changed = true;
    }
    if (this.song().year !== this.song().changes!.year) {
      this.song().changes!.yearChanged = true;
      this.song().changed = true;
    }
    if (this.song().disc !== this.song().changes!.disc) {
      this.song().changes!.discChanged = true;
      this.song().changed = true;
    }
    if (this.song().composer !== this.song().changes!.composer) {
      this.song().changes!.composerChanged = true;
      this.song().changed = true;
    }
    if (this.song().comment !== this.song().changes!.comment) {
      this.song().changes!.commentChanged = true;
      this.song().changed = true;
    }
    if (this.song().lyrics !== this.song().changes!.lyrics) {
      this.song().changes!.lyricsChanged = true;
      this.song().changed = true;
    }
    if (this.song().cover !== this.song().changes!.cover) {
      this.song().changes!.coverChanged = true;
      this.song().changed = true;
    }
    this.dialogRef.close(this.song());
  }
  extractFilename = utils.extractFilename;
}
