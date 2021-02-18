import ElasticSearch from "@elastic/elasticsearch";
import { Driver } from "../Driver";
import { ConnectionIsNotSetError } from "../../error/ConnectionIsNotSetError";
import { DriverPackageNotInstalledError } from "../../error/DriverPackageNotInstalledError";
import { ElasticSearchQueryRunner } from "./ElasticSearchQueryRunner";
import { ObjectLiteral } from "../../common/ObjectLiteral";
import { ColumnMetadata } from "../../metadata/ColumnMetadata";
import { PlatformTools } from "../../platform/PlatformTools";
import { Connection } from "../../connection/Connection";
import { ElasticSearchConnectionOptions } from "./ElasticSearchConnectionOptions";
import { MappedColumnTypes } from "../types/MappedColumnTypes";
import { ColumnType } from "../types/ColumnTypes";
import { DataTypeDefaults } from "../types/DataTypeDefaults";
import { TableColumn } from "../../schema-builder/table/TableColumn";
import { ConnectionOptions } from "../../connection/ConnectionOptions";
import { EntityMetadata } from "../../metadata/EntityMetadata";
import { ObjectUtils } from "../../util/ObjectUtils";
import { ApplyValueTransformers } from "../../util/ApplyValueTransformers";
import { ReplicationMode } from "../types/ReplicationMode";
import { DriverUtils } from "../DriverUtils";

/**
 * Organizes communication with ElasticSearch.
 */
export class ElasticSearchDriver implements Driver {

  // -------------------------------------------------------------------------
  // Public Properties
  // -------------------------------------------------------------------------

  /**
   * Underlying elasticsearch library.
   */
  elasticsearch: any;

  /**
   * ElasticSearch does not require to dynamically create query runner each time,
   * because it does not have a regular connection pool as RDBMS systems have.
   */
  queryRunner?: ElasticSearchQueryRunner;

  // -------------------------------------------------------------------------
  // Public Implemented Properties
  // -------------------------------------------------------------------------

  /**
   * Connection options.
   */
  options: ElasticSearchConnectionOptions;

  /**
   * Master database used to perform all write queries.
   */
  database?: string;

  /**
   * Indicates if replication is enabled.
   */
  isReplicated: boolean = false;

  /**
   * Indicates if tree tables are supported by this driver.
   */
  treeSupport = false;

  /**
   * ElasticSearch does not need to have column types because they are not used in schema sync.
   */
  supportedDataTypes: ColumnType[] = [];

  /**
   * Gets list of spatial column data types.
   */
  spatialTypes: ColumnType[] = [];

  /**
   * Gets list of column data types that support length by a driver.
   */
  withLengthColumnTypes: ColumnType[] = [];

  /**
   * Gets list of column data types that support precision by a driver.
   */
  withPrecisionColumnTypes: ColumnType[] = [];

  /**
   * Gets list of column data types that support scale by a driver.
   */
  withScaleColumnTypes: ColumnType[] = [];

  /**
   * ElasticSearch does not need to have a strong defined mapped column types because they are not used in schema sync.
   */
  mappedDataTypes: MappedColumnTypes = {
    createDate: "int",
    createDateDefault: "",
    updateDate: "int",
    updateDateDefault: "",
    deleteDate: "int",
    deleteDateNullable: true,
    version: "int",
    treeLevel: "int",
    migrationId: "int",
    migrationName: "int",
    migrationTimestamp: "int",
    cacheId: "int",
    cacheIdentifier: "int",
    cacheTime: "int",
    cacheDuration: "int",
    cacheQuery: "int",
    cacheResult: "int",
    metadataType: "int",
    metadataDatabase: "int",
    metadataSchema: "int",
    metadataTable: "int",
    metadataName: "int",
    metadataValue: "int",
  };

  /**
   * Default values of length, precision and scale depends on column data type.
   * Used in the cases when length/precision/scale is not specified by user.
   */
  dataTypeDefaults: DataTypeDefaults;

  /**
   * No documentation specifying a maximum length for identifiers could be found
   * for ElasticSearch.
   */
  maxAliasLength?: number;

  // -------------------------------------------------------------------------
  // Protected Properties
  // -------------------------------------------------------------------------

  /**
   * Valid elastic search connection options
   * NOTE: Keep sync with ElasticSearchConnectionOptions
   * Sync with https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/basic-config.html
   */
  protected validOptionNames: string[] = [
    "type",
    "url",
    "proxy",
    "host",
    "port",
    "apiKey",
    "username",
    "password",
    "maxRetries",
    "requestTimeoutMS",
    "pingTimeoutMS",
    "resurrectStrategy",
    "suggestCompression",
    "compression",
    "ssl",
    "sslValidate",
    "sslCA",
    "sslCert",
    "sslKey",
    "sslPass",
    "sslCRL",
    "nodeFilter",
    "nodeSelector",
    "name"
  ];

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(protected connection: Connection) {
    this.options = connection.options as ElasticSearchConnectionOptions;

    // validate options to make sure everything is correct and driver will be able to establish connection
    this.validateOptions(connection.options);

    // load elasticsearch package
    this.loadDependencies();
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  /**
   * Performs connection to the database.
   */
  connect(): Promise<void> {
    return new Promise<void>((ok, fail) => {
      const options = DriverUtils.buildDriverOptions(this.options);
      const client = new this.elasticsearch.Client(
        this.buildConnectionOptions(options)
      ) as ElasticSearch.Client;

      if (ElasticSearch.errors) {
        return fail(ElasticSearch.errors);
      }

      this.queryRunner = new ElasticSearchQueryRunner(this.connection, client);
      ObjectUtils.assign(this.queryRunner, { manager: this.connection.manager });
      ok();
    });
  }

  afterConnect(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Closes connection with the database.
   */
  async disconnect(): Promise<void> {
    return new Promise<void>((ok, fail) => {
      if (!this.queryRunner)
        return fail(new ConnectionIsNotSetError("elasticsearch"));

      const handler = (err: any) => err ? fail(err) : ok();
      this.queryRunner.databaseConnection.close(handler);
      this.queryRunner = undefined;
    });
  }

  /**
   * Creates a schema builder used to build and sync a schema.
   */
  createSchemaBuilder() {
    throw new Error(`This operation is not supported by ElasticSearch driver.`);
  }

  /**
   * Creates a query runner used to execute database queries.
   */
  createQueryRunner(mode: ReplicationMode) {
    return this.queryRunner!;
  }

  /**
   * Replaces parameters in the given sql with special escaping character
   * and an array of parameter names to be passed to a query.
   */
  escapeQueryWithParameters(sql: string, parameters: ObjectLiteral, nativeParameters: ObjectLiteral): [string, any[]] {
    throw new Error(`This operation is not supported by ElasticSearch driver.`);
  }

  /**
   * Escapes a column name.
   */
  escape(columnName: string): string {
    return columnName;
  }

  /**
   * Build full table name with database name, schema name and table name.
   * E.g. "myDB"."mySchema"."myTable"
   */
  buildTableName(tableName: string, schema?: string, database?: string): string {
    return tableName;
  }

  /**
   * Prepares given value to a value to be persisted, based on its column type and metadata.
   */
  preparePersistentValue(value: any, columnMetadata: ColumnMetadata): any {
    if (columnMetadata.transformer)
      value = ApplyValueTransformers.transformTo(columnMetadata.transformer, value);
    return value;
  }

  /**
   * Prepares given value to a value to be persisted, based on its column type or metadata.
   */
  prepareHydratedValue(value: any, columnMetadata: ColumnMetadata): any {
    if (columnMetadata.transformer)
      value = ApplyValueTransformers.transformFrom(columnMetadata.transformer, value);
    return value;
  }

  /**
   * Creates a database type from a given column metadata.
   */
  normalizeType(column: { type?: ColumnType, length?: number | string, precision?: number | null, scale?: number }): string {
    throw new Error(`ElasticSearch is schema-less, not supported by this driver.`);
  }

  /**
   * Normalizes "default" value of the column.
   */
  normalizeDefault(columnMetadata: ColumnMetadata): string | undefined {
    throw new Error(`ElasticSearch is schema-less, not supported by this driver.`);
  }

  /**
   * Normalizes "isUnique" value of the column.
   */
  normalizeIsUnique(column: ColumnMetadata): boolean {
    throw new Error(`ElasticSearch is schema-less, not supported by this driver.`);
  }

  /**
   * Calculates column length taking into account the default length values.
   */
  getColumnLength(column: ColumnMetadata): string {
    throw new Error(`ElasticSearch is schema-less, not supported by this driver.`);
  }

  /**
   * Normalizes "default" value of the column.
   */
  createFullType(column: TableColumn): string {
    throw new Error(`ElasticSearch is schema-less, not supported by this driver.`);
  }

  /**
   * Obtains a new database connection to a master server.
   * Used for replication.
   * If replication is not setup then returns default connection's database connection.
   */
  obtainMasterConnection(): Promise<any> {
    return Promise.resolve();
  }

  /**
   * Obtains a new database connection to a slave server.
   * Used for replication.
   * If replication is not setup then returns master (default) connection's database connection.
   */
  obtainSlaveConnection(): Promise<any> {
    return Promise.resolve();
  }

  /**
   * Creates generated map of values generated or returned by database after INSERT query.
   */
  createGeneratedMap(metadata: EntityMetadata, insertedId: any) {
    return metadata.objectIdColumn!.createValueMap(insertedId);
  }

  /**
   * Differentiate columns of this table and columns from the given column metadatas columns
   * and returns only changed.
   */
  findChangedColumns(tableColumns: TableColumn[], columnMetadatas: ColumnMetadata[]): ColumnMetadata[] {
    throw new Error(`ElasticSearch is schema-less, not supported by this driver.`);
  }

  /**
   * Returns true if driver supports RETURNING / OUTPUT statement.
   */
  isReturningSqlSupported(): boolean {
    return false;
  }

  /**
   * Returns true if driver supports uuid values generation on its own.
   */
  isUUIDGenerationSupported(): boolean {
    return false;
  }

  /**
   * Returns true if driver supports fulltext indices.
   */
  isFullTextColumnTypeSupported(): boolean {
    return false;
  }

  /**
   * Creates an escaped parameter.
   */
  createParameter(parameterName: string, index: number): string {
    return "";
  }

  // -------------------------------------------------------------------------
  // Protected Methods
  // -------------------------------------------------------------------------

  /**
   * Validate driver options to make sure everything is correct and driver will be able to establish connection.
   */
  protected validateOptions(options: ConnectionOptions) {
    for (let option in options) {
      console.assert(option in this.validOptionNames, `${option} is not a valid constructor option`);
    }
  }

  /**
   * Loads all driver dependencies.
   */
  protected loadDependencies(): any {
    try {
      // try to load native driver dynamically
      this.elasticsearch = PlatformTools.load("@elastic/elasticsearch");

    } catch (e) {
      throw new DriverPackageNotInstalledError("ElasticSearch", "@elastic/elasticsearch");
    }
  }

  /**
   * Builds connection url that is passed to underlying driver to perform connection to the ElasticSearch database.
   */
  protected buildConnectionUrl(options: ElasticSearchConnectionOptions): string {
    if (options.url) {
      return options.url;
    }

    const protocol = options.ssl ? "https" : "http";
    return `${protocol}://${options.host || "127.0.0.1"}:${options.port || 9200}`;
  }

  /**
   * Builds authentication that is passed to underlying driver to perform connection to the ElasticSearch database.
   */
  protected buildAuthentication(options: ElasticSearchConnectionOptions): Object {
    const { apiKey, username, password } = options;

    return {
      apiKey,
      username,
      password,
    };
  }

  /**
   * Builds SSL Configuration that is passed to underlying driver to perform connection to the ElasticSearch database.
   */
  protected buildSSLConfiguration(options: ElasticSearchConnectionOptions): Object | null {
    const {
      ssl,
      sslValidate,
      sslCA,
      sslCert,
      sslKey,
      sslPass,
      sslCRL,
    } = options;

    if (!ssl) {
      return null;
    }

    return {
      sslValidate,
      sslCA,
      sslCert,
      sslKey,
      sslPass,
      sslCRL,
    };
  }

  /**
   * Build connection options from ElasticSearchConnectionOptions
   */
  protected buildConnectionOptions(options: ElasticSearchConnectionOptions): ElasticSearch.ClientOptions {
    this.validateOptions(options);

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      type,
      url,
      host,
      port,
      apiKey,
      username,
      password,
      ssl,
      sslValidate,
      sslCA,
      sslCert,
      sslKey,
      sslPass,
      sslCRL,
      ...restOptions
    } = options;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    return {
      ...restOptions,
      node: this.buildConnectionUrl(options),
      /* @ts-ignore */
      auth: this.buildAuthentication(options),
      /* @ts-ignore */
      ssl: this.buildSSLConfiguration(options),
    };
  }

}
