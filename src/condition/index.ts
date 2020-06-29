class Condition {
  constructor(
    public readonly name: string,
    public readonly comparator: string,
    public readonly right: any
  ) {}

  static for(keyName);
}
