import _ from "lodash";

export class Label {
  public constructor(
    public readonly name: string,
    public readonly alias: string,
    public readonly parameters?: any
  ) {}

  static for(name: string, parameters: any = {}) {
    return new Label(
      name,
      parameters.alias || name,
      _.omit(parameters, "alias")
    );
  }
}

export class Relationship {
  public constructor(
    public readonly name: string,
    public readonly alias: string,
    public readonly parameters?: any
  ) {}

  static for(name: string, parameters: any = {}) {
    return new Relationship(
      name,
      parameters.alias || name,
      _.omit(parameters, "alias")
    );
  }
}

export const isRelationship = (name: string): boolean =>
  _.upperCase(name) === name;

export const isNodeLabel = (name: string): boolean =>
  _.upperFirst(_.camelCase(name)) === name;
