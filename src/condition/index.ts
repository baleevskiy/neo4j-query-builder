import _ from "lodash";
import { QueryContext } from "../context-builder";

interface ComparatorMap {
  contains: string;
  eq: string;
  gt: string;
  gte: string;
  in: string;
  lt: string;
  lte: string;
  ne: string;
}
class Comparator {
  private constructor(
    public readonly comparator: string,
    public readonly value: any
  ) {}

  static comparators: ComparatorMap = {
    contains: "CONTAINS",
    eq: "=",
    gt: ">",
    gte: ">=",
    in: "IN",
    lt: "<",
    lte: "<=",
    ne: "<>",
  };

  static for(comparatorName: keyof ComparatorMap, value: any) {
    const comparator = Comparator.comparators[comparatorName] as string;
    return new Comparator(comparator, value);
  }
}

type Field = (() => string) | string;
type FieldValue = any;

export class Condition {
  private constructor(
    public readonly left: Field,
    public readonly comparator: Comparator
  ) {}

  public getData() {
    return [];
  }

  static for(input: any): Condition[] {
    return _.map(input, (value, key) => {
      const parts = _.split(key, "__");
      if (parts.length > 1 && _.has(Comparator.comparators, _.last(parts)!)) {
        return [_.initial(parts), _.last(parts), value];
      }
      return [parts, "eq", value];
    }).map(
      ([nameParts, comparatorName, value]) =>
        new Condition(
          nameParts.join("."),
          Comparator.for(comparatorName, value)
        )
    );
  }
}
