import _ from 'lodash'
import {QueryContext} from '../context-builder'
class QueryBuilder{
  
  with?: AliasMap<QueryContext>;
  aliases?: AliasMap<string>;
  find?: FindClause[];
  where?: WhereClause[];
  merge?: MergeClause[];
  onCreateSet?: OnCreateSetClause[];
  setClause?: SetClause[];

  buildQuery(context: QueryContext): string {
    const resultStatements = []
    _.map(_.get(context,'find',[]), (findClause) => {
      `MATCH ${}`
    })

  }
}