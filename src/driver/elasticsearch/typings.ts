import { EventEmitter, Readable, Writable } from "../../platform/PlatformTools";

/**
 * Creates a new ElasticSearch Client instance.
 *
 * @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/index.html
 */
export declare class ElasticSearchClient extends EventEmitter {

  constructor(uri: string, options?: ElasticSearchClientOptions);

  /**
   * Connect to ElasticSearch using a url as documented at
   * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/client-connecting.html
   *
   * @param url The connection URI string.
   * @param callback The command result callback.
   */
  static connect(url: string, callback: ElasticSearchClientCallback<Db>): void;

  /**
   * Connect to ElasticSearch using a url as documented at
   * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/client-connecting.html
   *
   * @param url The connection URI string.
   * @param options Optional settings.
   */
  static connect(url: string, options?: ElasticSearchClientOptions): Promise<Db>;

  /**
   * Connect to ElasticSearch using a url as documented at
   * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/client-connecting.html
   *
   * @param url The connection URI string.
   * @param options Optional settings.
   * @param callback The command result callback.
   */
  static connect(url: string, options: ElasticSearchClientOptions, callback: ElasticSearchClientCallback<Db>): void;

  /**
   * Connect to ElasticSearch using a url as documented at
   * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/client-connecting.html
   */
  connect(): Promise<ElasticSearchClient>;

  /**
   * Connect to ElasticSearch using a url as documented at
   * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/client-connecting.html
   *
   * @param url The connection URI string.
   * @param callback The command result callback.
   */
  connect(url: string, callback: ElasticSearchClientCallback<Db>): void;

  /**
   * Connect to ElasticSearch using a url as documented at
   * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/client-connecting.html
   *
   * @param url The connection URI string.
   * @param options Optional settings.
   */
  connect(url: string, options?: ElasticSearchClientOptions): Promise<Db>;

  /**
   * Connect to ElasticSearch using a url as documented at
   * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/client-connecting.html
   *
   * @param url The connection URI string.
   * @param options Optional settings.
   * @param callback The command result callback.
   */
  connect(url: string, options: ElasticSearchClientOptions, callback: ElasticSearchClientCallback<Db>): void;

  // /**
  //  * Close the db and its underlying connections.
  //  * @param callback The result callback.
  //  * @see http://ElasticSearch.github.io/node-ElasticSearch-native/3.1/api/ElasticSearchClient.html#close
  //  */
  // close(callback: ElasticSearchClientCallback<void>): void;

  // /**
  //  * Close the db and its underlying connections.
  //  * @param force Force close, emitting no events.
  //  * @see http://ElasticSearch.github.io/node-ElasticSearch-native/3.1/api/ElasticSearchClient.html#close
  //  */
  // close(force?: boolean): Promise<void>;

  // /**
  //  * Close the db and its underlying connections.
  //  * @param force Force close, emitting no events.
  //  * @param callback The result callback.
  //  * @see http://ElasticSearch.github.io/node-ElasticSearch-native/3.1/api/ElasticSearchClient.html#close
  //  */
  // close(force: boolean, callback: ElasticSearchClientCallback<void>): void;

  // /**
  //  * Create a new Db instance sharing the current socket connections. Be aware that the new db instances are
  //  * related in a parent-child relationship to the original instance so that events are correctly emitted on child
  //  * db instances. Child db instances are cached so performing db('db1') twice will return the same instance.
  //  * You can control these behaviors with the options noListener and returnNonCachedInstance.
  //  * @param dbName The name of the database we want to use. If not provided, use database name from connection string.
  //  * @param options Optional settings.
  //  * @see http://ElasticSearch.github.io/node-ElasticSearch-native/3.1/api/ElasticSearchClient.html#db
  //  */
  // db(dbName?: string, options?: ElasticSearchClientCommonOption): Db;

  // /**
  //  * Check if ElasticSearchClient is connected.
  //  * @param options Optional settings.
  //  * @see http://ElasticSearch.github.io/node-ElasticSearch-native/3.1/api/ElasticSearchClient.html#isConnected
  //  */
  // isConnected(options?: ElasticSearchClientCommonOption): boolean;

  // /**
  //  * Logout user from server, fire off on all connections and remove all auth info.
  //  * @param callback The result callback.
  //  * @see http://ElasticSearch.github.io/node-ElasticSearch-native/3.1/api/ElasticSearchClient.html#logout
  //  */
  // logout(callback: ElasticSearchClientCallback<any>): void;
  // logout(options?: { dbName?: string }): Promise<any>;
  // logout(options: { dbName?: string }, callback: ElasticSearchClientCallback<any>): void;

  // /**
  //  * Starts a new session on the server.
  //  * @param options Optional settings.
  //  * @see http://ElasticSearch.github.io/node-ElasticSearch-native/3.1/api/ElasticSearchClient.html#startSession
  //  */
  // startSession(options?: SessionOptions): ClientSession;

  // /**
  //  * Create a new Change Stream, watching for new changes (insertions, updates, replacements, deletions, and invalidations) in this cluster.
  //  * Will ignore all changes to system collections, as well as the local, admin, and config databases.
  //  * @param pipeline An array of aggregation pipeline stages through which to pass change stream documents. This allows for filtering (using $match) and manipulating the change stream documents.
  //  * @param options Optional settings.
  //  * @see http://ElasticSearch.github.io/node-ElasticSearch-native/3.1/api/Collection.html#watch
  //  */
  // watch(pipeline?: Object[], options?: ChangeStreamOptions & { startAtClusterTime?: Timestamp, session?: ClientSession }): ChangeStream;

  // /**
  //  * Runs a given operation with an implicitly created session. The lifetime of the session will be handled without the need for user interaction.
  //  * @param operation An operation to execute with an implicitly created session. The signature of this MUST be `(session) => {}`
  //  * @see http://ElasticSearch.github.io/node-ElasticSearch-native/3.1/api/ElasticSearchClient.html#withSession
  //  */
  // withSession(operation: (session: ClientSession) => Promise<any>): Promise<void>;

  // /**
  //  * Runs a given operation with an implicitly created session. The lifetime of the session will be handled without the need for user interaction.
  //  * @param options Optional settings to be appled to implicitly created session.
  //  * @param operation An operation to execute with an implicitly created session. The signature of this MUST be `(session) => {}`
  //  * @see http://ElasticSearch.github.io/node-ElasticSearch-native/3.1/api/ElasticSearchClient.html#withSession
  //  */
  // withSession(options: SessionOptions, operation: (session: ClientSession) => Promise<any>): Promise<void>;
}

/**
 * The callback format for results.
 */
export interface ElasticSearchClientCallback<T> {

  /**
   * @param error An error instance representing the error during the execution.
   * @param result The result of execution.
   */
  (error: ElasticSearchClientError, result: T): void;
}

/**
 * The Error object exposed by Elastic Search client
 * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/client-connecting.html
 */
export declare class ElasticSearchClientError extends Error {
  constructor(name: string, message: string, meta?: Object);
  static create(options: ElasticSearchClientErrorOptions): ElasticSearchClientError;
}

/**
 * Base structure of all errors emitted from Elastic Search client
 */
export declare interface ElasticSearchClientErrorOptions {
  name: string;
  message: string;
  meta?: Object;
}

export declare interface ElasticSearchIndexOptions { }

/**
 * Strategy to select Elastic Search Node
 */
export declare type NodeSelector = "round-robin" | "random";
