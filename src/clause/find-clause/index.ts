import _ from "lodash";

export class FindClause {
  static of(config: any): FindClause[] {
    if (_.isObject(config)) {
      return _.map(config, (value, key) => new FindClause(key, value));
    }
    return [new FindClause(config)];
  }

  constructor(public readonly name: string, public readonly filter: any = {}) {}
}
