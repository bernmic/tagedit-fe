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
    public album: string,
    public genre: string,
    public track: string,
    public year: string,
    public disc: string,
    public composer: string,
    public comment: string,
    public lyrics: string,
    public cover: Cover,
    public changed: boolean,
    public new_name: string,
    // readonly attributes
    public file_type: string,
    public format: string,
    public bitrate: number,
    public samplerate: number,
    public duration: number,
    public stereo_mode: string,
    public bitrate_mode: string,
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
