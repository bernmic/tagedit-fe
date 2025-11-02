import { ComponentFixture, TestBed } from '@angular/core/testing';

import {SongEditDialog} from './song-edit.dialog';

describe('SongEditDialog', () => {
  let component: SongEditDialog;
  let fixture: ComponentFixture<SongEditDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongEditDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
