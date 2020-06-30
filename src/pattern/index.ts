import _ from "lodash";
import { Label, Relationship, isRelationship, isNodeLabel } from "../label";
import { QueryContext } from "../context-builder";
import { PatternParameters } from "../parameters";

export class Pattern {
  public constructor(public chain: Array<Label | Relationship>) {}

  public toString(context: QueryContext) {}

  public static for(patterns: any): Pattern[] {
    return _.map(patterns, (patternParams, pattern) => {
      return new Pattern(
        _.map(_.split(pattern, "__"), (part) => {
          const patternParamsObj = PatternParameters.for(patternParams[part]);

          if (isRelationship(part)) {
            return Relationship.for(part, patternParamsObj);
          }
          if (isNodeLabel(part)) {
            return Label.for(part, patternParamsObj);
          }
          throw new Error(
            `You cant use ${part} as a part of the pattern. Use CamelCase for NodeLabels or UPPER_CASE for relations`
          );
        })
      );
    });
  }
}
