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
  ) {}
}

export class Cover {
  constructor(
    public data: any,
    public mime: string,
  ) {
  }
}
