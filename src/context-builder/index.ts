import _ from "lodash";

interface Condition {}

interface AliasMap<T> {
  [key: string]: T;
}

interface MatchClause {}
interface FindOrCreateClause {}
interface MergeClause {}
interface OnCreateSetClause {}
interface SetClause {}
interface WhereClause {}
interface CreateClause {}
interface ReturnClause {}
interface OrderByClause {}
interface DeleteClause {}
interface LimitClause {}

interface ContextResolver<T = any> {
  (context: QueryContext): T;
}
export interface QueryContext {
  with?: AliasMap<QueryContext>;

  aliases?: AliasMap<string>;
  throwIfNotFound?: boolean;

  // patterns
  match?: MatchClause[];
  merge?: MergeClause[];
  create?: CreateClause[];

  // filters and update clauses
  where?: WhereClause[];
  onCreateSet?: OnCreateSetClause[];
  set?: SetClause[];

  //
  delete?: DeleteClause[];
  limit?: LimitClause[];
  orderBy?: OrderByClause[];
  return?: ReturnClause[];

  returnList?: boolean;
  returnSingle?: boolean;
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

  find(MatchClause: MatchClause) {
    if (this.context.returnList) {
      throw new Error("Don't mix findAll and find");
    }
    this.contextSet("returnSingle", true);
    return this.contextAdd("find", MatchClause);
  }

  findAll(MatchClause: MatchClause) {
    if (this.context.returnSingle) {
      throw new Error("Don't mix findAll and find");
    }
    this.contextSet("returnList", true);
    return this.contextAdd("find", MatchClause);
  }

  findOrCreate(mergeClause: MergeClause) {
    return this.merge(mergeClause);
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

  set(setClause: SetClause) {
    return this.contextAdd("set", setClause);
  }

  onCreateSetClause(onCreateSetClause: OnCreateSetClause) {
    return this.contextAdd("onCreateSet", onCreateSetClause);
  }

  delete(deleteClause: DeleteClause) {
    return this.contextAdd("delete", deleteClause);
  }

  limit(limit: number, offset: number) {
    return this.contextSet("limit", { limit, offset });
  }

  orderBy(orderBy: OrderByClause) {
    return this.contextSet("orderBy", orderBy);
  }

  throwIfNotFound() {
    return this.contextSet("throwIfNotFound", true);
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
