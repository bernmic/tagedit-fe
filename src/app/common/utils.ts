import {Song} from '../songs/song.model';

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

  static rename(pattern: string, song: Song) {
    let p = song.path.replace("%n", song.track)
    p = p.replace("%a", song.track);
    p = p.replace("%A", song.track);
    p = p.replace("%b", song.track);
    p = p.replace("%t", song.track);
    p = p.replace("%g", song.track);
    p = p.replace("%y", song.track);
    p = p.replace("%m", song.track);
    p = this.sanitizePath(p);
    if (p != song.path) {
      song.new_name = p;
      song.changed = true;
    }
  }

  static parse(pattern: string, song: Song) {
    if (!song) {
      return;
    }
    let filename = this.extractFilename(song.path);
    filename = this.removeExtension(filename);
    pattern = pattern.replaceAll("%", "%#");
    let parts = pattern.split("%");
    let changes = structuredClone(song);

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
            changes.track = filename.substring(0, cutpos);
            break;
          case 'a':
            changes.artist = filename.substring(0, cutpos);
            break;
          case 'b':
            changes.album = filename.substring(0, cutpos);
            break;
          case 'A':
            changes.album_artist = filename.substring(0, cutpos);
            break;
          case 't':
            changes.title = filename.substring(0, cutpos);
            break;
          case 'g':
            changes.genre = filename.substring(0, cutpos);
            break;
          case 'y':
            changes.year = filename.substring(0, cutpos);
            break;
          case 'm':
            changes.disc = filename.substring(0, cutpos);
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
    if (song.track !== changes.track) {
      console.log(`changed track from ${song.track} to ${changes.track}`);
      song.track = changes.track;
      song.changed = true;
    }
    if (song.title !== changes.title) {
      console.log(`changed title from ${song.track} to ${changes.title}`);
      song.title = changes.title;
      song.changed = true;
    }
    if (song.artist !== changes.artist) {
      song.artist = changes.artist;
      song.changed = true;
    }
    if (song.album !== changes.album) {
      song.album = changes.album;
      song.changed = true;
    }
    if (song.album_artist !== changes.album_artist) {
      song.album_artist = changes.album_artist;
      song.changed = true;
    }
    if (song.genre !== changes.genre) {
      song.genre = changes.genre;
      song.changed = true;
    }
    if (song.year !== changes.year) {
      song.year = changes.year;
      song.changed = true;
    }
    if (song.disc !== changes.disc) {
      song.disc = changes.disc;
      song.changed = true;
    }
  }

  static sanitizePath(path: string): string {
    path = path.replace(/[$]/g, 's');
    path = path.replace(/[:\\/*?|<>.]/g, '_');
    return path;
  }
}
