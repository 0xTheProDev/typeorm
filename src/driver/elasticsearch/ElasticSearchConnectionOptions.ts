import { BaseConnectionOptions } from "../../connection/BaseConnectionOptions";
import { NodeSelector } from "./typings";

/**
 * elasticsearchB specific connection options.
 * Synced with https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/basic-config.html
 */
export interface ElasticSearchConnectionOptions extends BaseConnectionOptions {

    /**
     * Database type.
     */
    readonly type: "elasticsearch";

    /**
     * Connection url where perform connection to.
     */
    readonly url?: string;

    /**
     * If you are using an http(s) proxy, you can put its url here.
     * The client will automatically handle the connection to it.
     */
    readonly proxy?: string;

    /**
     * Database host.
     */
    readonly host?: string;

    /**
     * Database host port.
     */
    readonly port?: number;

    /**
     * Database username.
     */
    readonly apiKey?: string | Object;

    /**
     * Database username.
     */
    readonly username?: string;

    /**
     * Database password.
     */
    readonly password?: string;

    /**
     * Server attempt to reconnect #times. Default 3
     */
    readonly maxRetries?: number;

    /**
     * Server will wait #milliseconds before timing out request. Default 30000
     */
    readonly requestTimeoutMS?: number;

    /**
     * Server will wait #milliseconds before timing out ping request. Default 3000
     */
    readonly pingTimeoutMS?: number;

    /**
     * Configure the node resurrection strategy. Default: ping
     */
    readonly resurrectStrategy?: "ping" | "optimistic" | "none";

    /**
     * Adds `accept-encoding` header to every request. Default: false
     */
    readonly suggestCompression?: boolean;

    /**
     * Enables gzip request body compression. Default: false
     */
    readonly compression?: "gzip" | false;

    /**
     * Use ssl connection (needs to have a elasticsearch server with ssl support). Default: false
     */
    readonly ssl?: boolean;

    /**
     * Validate elasticsearch server certificate against ca (needs to have a elasticsearch server with ssl support, 2.4 or higher).
     * Default: true
     */
    readonly sslValidate?: boolean;

    /**
     * Array of valid certificates either as Buffers or Strings
     * (needs to have a elasticsearch server with ssl support, 2.4 or higher).
     */
    readonly sslCA?: string[] | Buffer[];

    /**
     * String or buffer containing the certificate we wish to present
     * (needs to have a elasticsearch server with ssl support, 2.4 or higher)
     */
    readonly sslCert?: string | Buffer;

    /**
     * String or buffer containing the certificate private key we wish to present
     * (needs to have a elasticsearch server with ssl support, 2.4 or higher)
     */
    readonly sslKey?: string;

    /**
     * String or buffer containing the certificate password
     * (needs to have a elasticsearch server with ssl support, 2.4 or higher)
     */
    readonly sslPass?: string | Buffer;

    /**
     * SSL Certificate revocation list binary buffer
     * (needs to have a elasticsearch server with ssl support, 2.4 or higher)
     */
    readonly sslCRL?: string | Buffer;

    /**
     * Filters which node not to use for a request.
     * By default it avoids master only nodes
     */
    readonly nodeFilter?: () => boolean;

    /**
     * Custom selection strategy. Options: 'round-robin', 'random' or custom function. Default: 'round-robin'
     */
    readonly nodeSelector?: NodeSelector | ((connections: any) => NodeSelector);

    /**
     * The name to identify the client instance in the events. Default: elasticsearch-js
     */
    readonly name?: string | Symbol;
}
