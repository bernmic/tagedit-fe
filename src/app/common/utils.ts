import {Song, SongChanges} from '../songs/song.model';

export class utils {
  static extractFilename(path: string): string {
    // @ts-ignore
    return path.split('\\').pop().split('/').pop()
  }

  static removeFilename(path: string): string {
    return path.substring(0, path.lastIndexOf("/"));
  }

  static extractExtension(path: string): string {
    return path.substring(path.lastIndexOf("."));
  }

  static removeExtension(path: string): string {
    return path.substring(0, path.lastIndexOf("."));
  }

  static pad(num: number, size: number): string {
    return (""+num).padStart(size, '0');
  }

  static capitalize(s: string): string {
    let splitStr = s.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  static capitalizeFilename(path: string): string {
    let fn = utils.removeExtension(utils.extractFilename(path));
    let p = utils.removeFilename(path);
    let ext = utils.extractExtension(path);
    return `${p}/${utils.capitalize(fn)}${ext}`;
  }

  static filenameRemoveUnderscores(path: string): string {
    let fn = utils.extractFilename(path);
    let p = utils.removeFilename(path);
    fn = fn.replaceAll("_", " ");
    return `${p}/${fn}`;
  }

  static capitalizeSong(song: Song): Song {
    let songClone = SongChanges.fromSong(song);
    songClone.title = utils.capitalize(song.title);
    songClone.artist = utils.capitalize(song.artist);
    songClone.album = utils.capitalize(song.album);
    songClone.album_artist = utils.capitalize(song.album_artist);
    songClone.genre = utils.capitalize(song.genre);
    if (song.title !== songClone.title) {
      songClone.titleChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
    if (song.artist !== songClone.artist) {
      songClone.artistChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
    if (song.album !== songClone.album) {
      songClone.albumChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
    if (song.genre !== songClone.genre) {
      songClone.genreChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
    if (song.album_artist !== songClone.album_artist) {
      songClone.albumArtistChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
    return song;
  }

  static rename(pattern: string, song: Song): string {
    let p = pattern;
    p = p.replace("%n", utils.sanitizeTrack(song));
    p = p.replace("%a", song.artist);
    p = p.replace("%A", song.album_artist);
    p = p.replace("%b", song.album);
    p = p.replace("%t", song.title);
    p = p.replace("%g", song.genre);
    p = p.replace("%y", song.year);
    p = p.replace("%m", song.disc);
    p = utils.sanitizePath(p);
    return p;
  }

  static sanitizeTrack(song:Song): string {
    if (song.track) {
      return song.track.split("/")[0].padStart(2, '0');
    }
    return "";
  }

  static parse(pattern: string, song: Song) {
    if (!song) {
      return;
    }
    let filename = this.extractFilename(song.path);
    filename = this.removeExtension(filename);
    pattern = pattern.replaceAll("%", "%#");
    let parts = pattern.split("%");
    let songClone = SongChanges.fromSong(song);

    for (let part of parts) {
      if (!part.startsWith("#") || part.length == 1) {
        if (!filename.startsWith(part)) {
          // no match. leave.
          break;
        }
        filename = filename.substring(part.length);
        if (filename.length == 0) {
          break;
        }
        continue;
      }
      let t = part.charAt(1);
      part = part.substring(2);
      let cutpos = (part.length > 0) ? filename.indexOf(part) : filename.length;
      if (cutpos >= 0) {
        switch (t) {
          case 'n':
            songClone.track = filename.substring(0, cutpos);
            break;
          case 'a':
            songClone.artist = filename.substring(0, cutpos);
            break;
          case 'b':
            songClone.album = filename.substring(0, cutpos);
            break;
          case 'A':
            songClone.album_artist = filename.substring(0, cutpos);
            break;
          case 't':
            songClone.title = filename.substring(0, cutpos);
            break;
          case 'g':
            songClone.genre = filename.substring(0, cutpos);
            break;
          case 'y':
            songClone.year = filename.substring(0, cutpos);
            break;
          case 'm':
            songClone.disc = filename.substring(0, cutpos);
            break;
        }
        filename = filename.substring(cutpos);
      }
      if (!filename.startsWith(part)) {
        // no match. leave.
        break;
      }
      filename = filename.substring(part.length);
      if (filename.length == 0) {
        break;
      }
    }
    if (song.title !== songClone.title) {
      songClone.titleChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
    if (song.artist !== songClone.artist) {
      songClone.artistChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
    if (song.album !== songClone.album) {
      songClone.albumChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
    if (song.genre !== songClone.genre) {
      songClone.genreChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
    if (song.album_artist !== songClone.album_artist) {
      songClone.albumArtistChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
    if (song.track !== songClone.track) {
      songClone.trackChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
    if (song.year !== songClone.year) {
      songClone.yearChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
    if (song.disc !== songClone.disc) {
      songClone.discChanged = true;
      song.changes = songClone;
      song.changed = true;
    }
  }

  static sanitizePath(path: string): string {
    path = path.replace(/[$]/g, 's');
    path = path.replace(/[:\\/*?|<>.]/g, '_');
    return path;
  }
}
