class Relation {
  constructor(
    public readonly leftLabel: string,
    public readonly rightLabel: string,
    public readonly relationName?: string
  ) {}

  static from(key: string) {
    const [leftLabel, relationName, rightLabel] = key.split("__");
    return rightLabel
      ? new Relation(leftLabel, rightLabel, relationName)
      : new Relation(leftLabel, relationName);
  }
}
