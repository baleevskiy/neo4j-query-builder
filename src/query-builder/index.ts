import _ from "lodash";
import { QueryContext, ContextBuilder } from "../context-builder";
import { Pattern } from "../pattern";

interface NeoQueryStructure {
  match: string[];
  create: string[];
  merge: string[];

  onCreateSet: string[];
  set: string[];

  with: string[];
  where: string[];

  delete: string[];
  limit: string[];
  orderBy: string[];
  return: string[];
}

const patternClauses = ["match", "create", "merge"];
const updateClauses = ["onCreateSet", "set"];
const filterClauses = ["where"];
const plainStringClauses = ["delete", "limit", "orderBy", "return"];

const builders = [
  [patternClauses, Pattern],
  [updateClauses, Pattern],
  [filterClauses, Pattern],
  [plainStringClauses, Pattern],
];
/**
 *  this class puts all the classes
 *
 **/
class QueryBuilder {
  static mapContextValues(context: QueryContext) {
    const patterns = _.map(patternClauses, (clauseName: keyof QueryContext) => {
      return Pattern.for(context[clauseName]);
    });
  }

  // Creates a ContextBuilder, QueryBuilder and then
  static for(queryRunner: (query: string) => any): ContextBuilder {}

  buildQuery(context: QueryContext): string {}
}
