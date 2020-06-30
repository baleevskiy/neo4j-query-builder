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
interface CreateClause {}
interface ReturnClause {}

interface ContextResolver<T = any> {
  (context: QueryContext): T;
}
export interface QueryContext {
  with?: AliasMap<QueryContext>;
  aliases?: AliasMap<string>;
  find?: FindClause[];
  findAll?: FindClause[];
  where?: WhereClause[];
  merge?: MergeClause[];
  create?: CreateClause[];
  onCreateSet?: OnCreateSetClause[];
  set?: SetClause[];
  return?: ReturnClause[];
}

export class ContextBuilder<T = any> {
  private context: QueryContext = {};
  private contextResolver: ContextResolver;

  constructor(contextResolver: ContextResolver, context = {}) {
    this.context = context;
    this.contextResolver = contextResolver;
  }

  private of(context: any): ContextBuilder {
    return new ContextBuilder(this.contextResolver, context);
  }

  private contextAdd(key: string, value: any): ContextBuilder {
    value = _.get(this.context, key, []).concat(value);
    return this.of(_.defaults({}, { [key]: value }, this.context));
  }

  private contextSetKey(mapName: string, key: string, value: any) {
    value = _.defaults({ [key]: value }, _.get(this.context, mapName, {}));
    return this.of(_.defaults({}, { [mapName]: value }, this.context));
  }

  private contextSet(mapName: string, value: any) {
    return this.of(_.defaults({}, { [mapName]: value }, this.context));
  }

  with(withClause: ContextBuilder, alias: string) {
    return this.contextSetKey("with", alias, withClause.context);
  }

  find(findClause: FindClause) {
    return this.contextAdd("find", findClause);
  }

  where(whereClause: WhereClause) {
    return this.contextAdd("where", whereClause);
  }

  return(returnClause: ReturnClause) {
    return this.contextSet("return", returnClause);
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
