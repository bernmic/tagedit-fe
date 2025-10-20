export class utils {
  static extractFilename(path: string) {
    // @ts-ignore
    return path.split('\\').pop().split('/').pop()
  }

  static removeFilename(path: string) {
    return path.substring(0, path.lastIndexOf("/"));
  }

  static extractExtension(path: string) {
    return path.substring(path.lastIndexOf("."));
  }
}
