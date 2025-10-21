import {Component, inject, model, OnInit} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Song} from './song.model';
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
  templateUrl: 'song-edit.html',
  styleUrls: ['song-edit.scss'],
  imports: [
    DurationPipe,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
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
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  extractFilename = utils.extractFilename;
}
