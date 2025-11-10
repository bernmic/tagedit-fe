export class SongList {
  constructor(
    public songs: Song[],
    public count: number,
  ){}
}

export class Song {
  constructor(
    public path: string,
    public title: string,
    public artist: string,
    public album_artist: string,
    public album: string,
    public genre: string,
    public track: string,
    public year: string,
    public disc: string,
    public composer: string,
    public comment: string,
    public lyrics: string,
    public cover: Cover,
    // update only fields
    public changed: boolean,
    public new_name: string,
    public remove_id3v1: boolean,
    public remove_id3v2: boolean,
    // readonly attributes
    public file_type: string,
    public format: string,
    public bitrate: number,
    public samplerate: number,
    public duration: number,
    public stereo_mode: string,
    public bitrate_mode: string,
    public has_id3_v2: boolean,
    public has_id3_v1: boolean,
    // calculated attributes
    public displayPath?: string,
    public changes?: SongChanges,
  ) {}
}

export class SongChanges {
  constructor(
    public title?: string,
    public titleChanged: boolean = false,
    public artist?: string,
    public artistChanged: boolean = false,
    public album_artist?: string,
    public albumArtistChanged: boolean = false,
    public album?: string,
    public albumChanged: boolean = false,
    public genre?: string,
    public genreChanged: boolean = false,
    public track?: string,
    public trackChanged: boolean = false,
    public year?: string,
    public yearChanged: boolean = false,
    public disc?: string,
    public discChanged: boolean = false,
    public composer?: string,
    public composerChanged: boolean = false,
    public comment?: string,
    public commentChanged: boolean = false,
    public lyrics?: string,
    public lyricsChanged: boolean = false,
    public cover?: Cover,
    public coverChanged: boolean = false,
  ) {}
  static fromSong(song: Song): SongChanges {
    let result = new SongChanges();
    result.title = song.title;
    result.artist = song.artist;
    result.album_artist = song.album_artist;
    result.album = song.album;
    result.genre = song.genre;
    result.track = song.track;
    result.year = song.year;
    result.disc = song.disc;
    result.composer = song.composer;
    result.comment = song.comment;
    result.lyrics = song.lyrics;
    result.cover = song.cover;
    return result;
  }
}

export class Cover {
  constructor(
    public data: any,
    public mime: string,
  ) {
  }
}
