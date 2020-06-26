import _ from "lodash";

interface Condition {}

interface AliasMap<T> {
  [key: string]: T;
}

interface FindClause {}
interface MergeClause {}
interface OnCreateSetClause {}
interface SetClause {}
interface WhereClause {}

interface ContextResolver<T> {
  (context: QueryContext): T;
}
interface QueryContext {
  with?: AliasMap<QueryContext>;
  aliases?: AliasMap<string>;
  find?: FindClause[];
  where?: WhereClause[];
  merge?: MergeClause[];
  onCreateSet?: OnCreateSetClause[];
  setClause?: SetClause[];
}

export class QueryBuilder<T> {
  private context: QueryContext = {};
  private contextResolver: ContextResolver<T>;

  constructor(contextResolver: ContextResolver<T>, context = {}) {
    this.context = context;
    this.contextResolver = contextResolver;
  }

  private of(context: any) {
    return new QueryBuilder(this.contextResolver, context);
  }

  private contextAdd(key: string, value: any) {
    value = _.get(this.context, key, []).concat(value);
    return this.of(_.defaults({}, { [key]: value }, this.context));
  }

  private contextSet(mapName: string, key: string, value: any) {
    value = _.defaults({ [key]: value }, _.get(this.context, mapName, {}));
    return this.of(_.defaults({}, { [mapName]: value }, this.context));
  }

  with(withClause: QueryBuilder<T>, alias: string) {
    return this.contextSet("with", alias, withClause.context);
  }

  find(findClause: FindClause) {
    return this.contextAdd("find", findClause);
  }

  where(whereClause: WhereClause) {
    return this.contextAdd("where", whereClause);
  }

  merge(mergeClause: MergeClause) {
    return this.contextAdd("merge", mergeClause);
  }

  onCreateSetClause(onCreateSetClause: OnCreateSetClause) {
    return this.contextAdd("onCreateSet", onCreateSetClause);
  }

  get promise(): Promise<T> {
    return Promise.resolve(this.contextResolver(this.context));
  }

  then(
    resolve: (param: T) => Promise<any>,
    reject?: (reason: any) => any
  ): Promise<T> {
    return this.promise.then(resolve, reject);
  }
  catch(cb: (reason: any) => any) {
    return this.promise.catch(cb);
  }
}
