import _ from "lodash";
import { QueryContext } from "../context-builder";

interface OperatorMap {
  contains: string;
  eq: string;
  gt: string;
  gte: string;
  in: string;
  lt: string;
  lte: string;
  ne: string;
  is_null: string;
  merge: string;
}
class Comparator {
  private constructor(
    public readonly comparator: string,
    public readonly value: any
  ) {}

  static operators: OperatorMap = {
    contains: "CONTAINS",
    eq: "=",
    gt: ">",
    gte: ">=",
    in: "IN",
    lt: "<",
    lte: "<=",
    ne: "<>",
    is_null: "IS NULL",
    merge: "+=",
  };

  static for(comparatorName: keyof OperatorMap, value: any) {
    const comparator = Comparator.operators[comparatorName] as string;
    return new Comparator(comparator, value);
  }
}

type Field = (() => string) | string;

export class FilterParameters {
  private constructor(
    public readonly left: Field,
    public readonly comparator: Comparator
  ) {}

  public getData() {
    return [];
  }

  static for(input: any): FilterParameters[] {
    return _.map(input, (value, key) => {
      const parts = _.split(key, "__");
      if (parts.length > 1 && _.has(Comparator.operators, _.last(parts)!)) {
        return [_.initial(parts), _.last(parts), value];
      }
      return [parts, "eq", value];
    }).map(
      ([nameParts, comparatorName, value]) =>
        new FilterParameters(
          nameParts.join("."),
          Comparator.for(comparatorName, value)
        )
    );
  }
}

export class PatternParameters {
  public constructor(public readonly params: any) {}

  static for(filterData: any): PatternParameters {
    return new PatternParameters(filterData);
  }
}
