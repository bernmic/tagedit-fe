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
  ) {}
}

export class Cover {
  constructor(
    public data: any,
    public mime: string,
  ) {
  }
}
