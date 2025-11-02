import {Component, ElementRef, inject, model, ViewChild} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Song} from '../songs/song.model';
import {SongData} from './song-edit.dialog';
import {utils} from '../common/utils';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {debounceTime, distinctUntilChanged, fromEvent, tap} from 'rxjs';

export interface RenameData {
  renamePattern: string;
  songs: Song[];
}

@Component({
  selector: 'rename-dialog',
  templateUrl: './rename.dialog.html',
  styleUrls: ['./rename.dialog.scss'],
  imports: [
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogContent,
    MatDialogTitle,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogActions,
  ],
})
export class RenameDialog {
  readonly dialogRef = inject(MatDialogRef<RenameDialog>);
  readonly data = inject<RenameData>(MAT_DIALOG_DATA);
  readonly renamePattern = model(this.data.renamePattern);
  @ViewChild('patternInput') patternInput!: ElementRef;
  exampleRename = ""

  ngOnInit(): void {
    this.exampleRename = this.renameFilename(this.renamePattern(), this.data.songs[0]);
    this.exampleRename = this.exampleRename + this.extractExtension(this.data.songs[0].path);
  }

  ngAfterViewInit() {
    fromEvent(this.patternInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.exampleRename = this.renameFilename(this.renamePattern(), this.data.songs[0]);
          this.exampleRename = this.exampleRename + this.extractExtension(this.data.songs[0].path);
        })
      )
      .subscribe();
  }
  onCancelClick(): void {
    this.dialogRef.close();
  }

  onOkClick(): void {
    this.dialogRef.close();
  }

  extractFilename = utils.extractFilename;
  extractExtension = utils.extractExtension;
  renameFilename = utils.rename;
}
