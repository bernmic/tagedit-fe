import {Component, inject, model} from '@angular/core';
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

export interface SongData {
  song: Song;
}

@Component({
  selector: 'song-dialog',
  templateUrl: 'song-edit.html',
  styleUrls: ['song-edit.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class SongEditDialog {
  readonly dialogRef = inject(MatDialogRef<SongEditDialog>);
  readonly data = inject<SongData>(MAT_DIALOG_DATA);
  readonly song = model(this.data.song);

  onCancelClick(): void {
    this.dialogRef.close();
  }

  extractFilename = utils.extractFilename;
}
