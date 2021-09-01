'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const graphql = require('graphql');
const visitorPluginCommon = require('@graphql-codegen/visitor-plugin-common');
const autoBind = _interopDefault(require('auto-bind'));
const changeCaseAll = require('change-case-all');
const path = require('path');

function generateQueryVariablesSignature(hasRequiredVariables, operationVariablesTypes) {
    return `variables${hasRequiredVariables ? '' : '?'}: ${operationVariablesTypes}`;
}
function generateQueryKey(node) {
    return `['${node.name.value}', variables]`;
}
function generateQueryKeyMaker(node, operationName, operationVariablesTypes, hasRequiredVariables) {
    const signature = generateQueryVariablesSignature(hasRequiredVariables, operationVariablesTypes);
    return `\nuse${operationName}.getKey = (${signature}) => ${generateQueryKey(node)};\n`;
}

class FetchFetcher {
    constructor(visitor) {
        this.visitor = visitor;
    }
    generateFetcherImplementaion() {
        return `
function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}`;
    }
    generateQueryHook(node, documentVariableName, operationName, operationResultType, operationVariablesTypes, hasRequiredVariables) {
        const variables = generateQueryVariablesSignature(hasRequiredVariables, operationVariablesTypes);
        const hookConfig = this.visitor.queryMethodMap;
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.query.hook);
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.query.options);
        const options = `options?: ${hookConfig.query.options}<${operationResultType}, TError, TData>`;
        return `export const use${operationName} = <
      TData = ${operationResultType},
      TError = ${this.visitor.config.errorType}
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      ${variables}, 
      ${options}
    ) => 
    ${hookConfig.query.hook}<${operationResultType}, TError, TData>(
      ${generateQueryKey(node)},
      fetcher<${operationResultType}, ${operationVariablesTypes}>(dataSource.endpoint, dataSource.fetchParams || {}, ${documentVariableName}, variables),
      options
    );`;
    }
    generateMutationHook(node, documentVariableName, operationName, operationResultType, operationVariablesTypes) {
        const variables = `variables?: ${operationVariablesTypes}`;
        const hookConfig = this.visitor.queryMethodMap;
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.mutation.hook);
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.mutation.options);
        const options = `options?: ${hookConfig.mutation.options}<${operationResultType}, TError, ${operationVariablesTypes}, TContext>`;
        return `export const use${operationName} = <
      TError = ${this.visitor.config.errorType},
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit }, 
      ${options}
    ) => 
    ${hookConfig.mutation.hook}<${operationResultType}, TError, ${operationVariablesTypes}, TContext>(
      (${variables}) => fetcher<${operationResultType}, ${operationVariablesTypes}>(dataSource.endpoint, dataSource.fetchParams || {}, ${documentVariableName}, variables)(),
      options
    );`;
    }
    generateFetcherFetch(node, documentVariableName, operationName, operationResultType, operationVariablesTypes, hasRequiredVariables) {
        const variables = generateQueryVariablesSignature(hasRequiredVariables, operationVariablesTypes);
        return `\nuse${operationName}.fetcher = (${variables}) => fetcher<${operationResultType}, ${operationVariablesTypes}>(dataSource.endpoint, dataSource.fetchParams || {}, ${documentVariableName}, variables);`;
    }
}

class HardcodedFetchFetcher {
    constructor(visitor, config) {
        this.visitor = visitor;
        this.config = config;
    }
    getEndpoint() {
        try {
            new URL(this.config.endpoint);
            return JSON.stringify(this.config.endpoint);
        }
        catch (e) {
            return `${this.config.endpoint} as string`;
        }
    }
    getFetchParams() {
        const fetchParams = {
            method: 'POST',
            ...(this.config.fetchParams || {}),
        };
        return Object.keys(fetchParams)
            .map(key => {
            return `      ${key}: ${JSON.stringify(fetchParams[key])},`;
        })
            .join('\n');
    }
    generateFetcherImplementaion() {
        return `
function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(${this.getEndpoint()}, {
${this.getFetchParams()}
      body: JSON.stringify({ query, variables }),
    });
    
    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}`;
    }
    generateQueryHook(node, documentVariableName, operationName, operationResultType, operationVariablesTypes, hasRequiredVariables) {
        const variables = generateQueryVariablesSignature(hasRequiredVariables, operationVariablesTypes);
        const hookConfig = this.visitor.queryMethodMap;
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.query.hook);
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.query.options);
        const options = `options?: ${hookConfig.query.options}<${operationResultType}, TError, TData>`;
        return `export const use${operationName} = <
      TData = ${operationResultType},
      TError = ${this.visitor.config.errorType}
    >(
      ${variables}, 
      ${options}
    ) => 
    ${hookConfig.query.hook}<${operationResultType}, TError, TData>(
      ${generateQueryKey(node)},
      fetcher<${operationResultType}, ${operationVariablesTypes}>(${documentVariableName}, variables),
      options
    );`;
    }
    generateMutationHook(node, documentVariableName, operationName, operationResultType, operationVariablesTypes) {
        const variables = `variables?: ${operationVariablesTypes}`;
        const hookConfig = this.visitor.queryMethodMap;
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.mutation.hook);
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.mutation.options);
        const options = `options?: ${hookConfig.mutation.options}<${operationResultType}, TError, ${operationVariablesTypes}, TContext>`;
        return `export const use${operationName} = <
      TError = ${this.visitor.config.errorType},
      TContext = unknown
    >(${options}) => 
    ${hookConfig.mutation.hook}<${operationResultType}, TError, ${operationVariablesTypes}, TContext>(
      (${variables}) => fetcher<${operationResultType}, ${operationVariablesTypes}>(${documentVariableName}, variables)(),
      options
    );`;
    }
    generateFetcherFetch(node, documentVariableName, operationName, operationResultType, operationVariablesTypes, hasRequiredVariables) {
        const variables = generateQueryVariablesSignature(hasRequiredVariables, operationVariablesTypes);
        return `\nuse${operationName}.fetcher = (${variables}) => fetcher<${operationResultType}, ${operationVariablesTypes}>(${documentVariableName}, variables);`;
    }
}

class GraphQLRequestClientFetcher {
    constructor(visitor) {
        this.visitor = visitor;
    }
    generateFetcherImplementaion() {
        return `
function fetcher<TData, TVariables>(client: GraphQLClient, query: string, variables?: TVariables) {
  return async (): Promise<TData> => client.request<TData, TVariables>(query, variables);
}`;
    }
    generateQueryHook(node, documentVariableName, operationName, operationResultType, operationVariablesTypes, hasRequiredVariables) {
        const variables = generateQueryVariablesSignature(hasRequiredVariables, operationVariablesTypes);
        const typeImport = this.visitor.config.useTypeImports ? 'import type' : 'import';
        this.visitor.imports.add(`${typeImport} { GraphQLClient } from 'graphql-request';`);
        const hookConfig = this.visitor.queryMethodMap;
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.query.hook);
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.query.options);
        const options = `options?: ${hookConfig.query.options}<${operationResultType}, TError, TData>`;
        return `export const use${operationName} = <
      TData = ${operationResultType},
      TError = ${this.visitor.config.errorType}
    >(
      client: GraphQLClient, 
      ${variables}, 
      ${options}
    ) => 
    ${hookConfig.query.hook}<${operationResultType}, TError, TData>(
      ${generateQueryKey(node)},
      fetcher<${operationResultType}, ${operationVariablesTypes}>(client, ${documentVariableName}, variables),
      options
    );`;
    }
    generateMutationHook(node, documentVariableName, operationName, operationResultType, operationVariablesTypes) {
        const variables = `variables?: ${operationVariablesTypes}`;
        this.visitor.imports.add(`import { GraphQLClient } from 'graphql-request';`);
        const hookConfig = this.visitor.queryMethodMap;
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.mutation.hook);
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.mutation.options);
        const options = `options?: ${hookConfig.mutation.options}<${operationResultType}, TError, ${operationVariablesTypes}, TContext>`;
        return `export const use${operationName} = <
      TError = ${this.visitor.config.errorType},
      TContext = unknown
    >(
      client: GraphQLClient, 
      ${options}
    ) => 
    ${hookConfig.mutation.hook}<${operationResultType}, TError, ${operationVariablesTypes}, TContext>(
      (${variables}) => fetcher<${operationResultType}, ${operationVariablesTypes}>(client, ${documentVariableName}, variables)(),
      options
    );`;
    }
    generateFetcherFetch(node, documentVariableName, operationName, operationResultType, operationVariablesTypes, hasRequiredVariables) {
        const variables = generateQueryVariablesSignature(hasRequiredVariables, operationVariablesTypes);
        return `\nuse${operationName}.fetcher = (client: GraphQLClient, ${variables}) => fetcher<${operationResultType}, ${operationVariablesTypes}>(client, ${documentVariableName}, variables);`;
    }
}

class CustomMapperFetcher {
    constructor(visitor, customFetcher) {
        this.visitor = visitor;
        if (typeof customFetcher === 'string') {
            customFetcher = { func: customFetcher };
        }
        this._mapper = visitorPluginCommon.parseMapper(customFetcher.func);
        this._isReactHook = customFetcher.isReactHook;
    }
    getFetcherFnName(operationResultType, operationVariablesTypes) {
        return `${this._mapper.type}<${operationResultType}, ${operationVariablesTypes}>`;
    }
    generateFetcherImplementaion() {
        if (this._mapper.isExternal) {
            return visitorPluginCommon.buildMapperImport(this._mapper.source, [
                {
                    identifier: this._mapper.type,
                    asDefault: this._mapper.default,
                },
            ], this.visitor.config.useTypeImports);
        }
        return null;
    }
    generateQueryHook(node, documentVariableName, operationName, operationResultType, operationVariablesTypes, hasRequiredVariables) {
        const variables = `variables${hasRequiredVariables ? '' : '?'}: ${operationVariablesTypes}`;
        const hookConfig = this.visitor.queryMethodMap;
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.query.hook);
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.query.options);
        const options = `options?: ${hookConfig.query.options}<${operationResultType}, TError, TData>`;
        const typedFetcher = this.getFetcherFnName(operationResultType, operationVariablesTypes);
        const impl = this._isReactHook
            ? `${typedFetcher}(${documentVariableName}).bind(null, variables)`
            : `${typedFetcher}(${documentVariableName}, variables)`;
        return `export const use${operationName} = <
      TData = ${operationResultType},
      TError = ${this.visitor.config.errorType}
    >(
      ${variables}, 
      ${options}
    ) => 
    ${hookConfig.query.hook}<${operationResultType}, TError, TData>(
      ['${node.name.value}', variables],
      ${impl},
      options
    );`;
    }
    generateMutationHook(node, documentVariableName, operationName, operationResultType, operationVariablesTypes) {
        const variables = `variables?: ${operationVariablesTypes}`;
        const hookConfig = this.visitor.queryMethodMap;
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.mutation.hook);
        this.visitor.reactQueryIdentifiersInUse.add(hookConfig.mutation.options);
        const options = `options?: ${hookConfig.mutation.options}<${operationResultType}, TError, ${operationVariablesTypes}, TContext>`;
        const typedFetcher = this.getFetcherFnName(operationResultType, operationVariablesTypes);
        const impl = this._isReactHook
            ? `${typedFetcher}(${documentVariableName})`
            : `(${variables}) => ${typedFetcher}(${documentVariableName}, variables)()`;
        return `export const use${operationName} = <
      TError = ${this.visitor.config.errorType},
      TContext = unknown
    >(${options}) => 
    ${hookConfig.mutation.hook}<${operationResultType}, TError, ${operationVariablesTypes}, TContext>(
      ${impl},
      options
    );`;
    }
    generateFetcherFetch(node, documentVariableName, operationName, operationResultType, operationVariablesTypes, hasRequiredVariables) {
        // We can't generate a fetcher field since we can't call react hooks outside of a React Fucntion Component
        // Related: https://reactjs.org/docs/hooks-rules.html
        if (this._isReactHook)
            return '';
        const variables = `variables${hasRequiredVariables ? '' : '?'}: ${operationVariablesTypes}`;
        const typedFetcher = this.getFetcherFnName(operationResultType, operationVariablesTypes);
        const impl = `${typedFetcher}(${documentVariableName}, variables)`;
        return `\nuse${operationName}.fetcher = (${variables}) => ${impl};`;
    }
}

class ReactQueryVisitor extends visitorPluginCommon.ClientSideBaseVisitor {
    constructor(schema, fragments, rawConfig, documents) {
        super(schema, fragments, rawConfig, {
            documentMode: visitorPluginCommon.DocumentMode.string,
            errorType: visitorPluginCommon.getConfigValue(rawConfig.errorType, 'unknown'),
            exposeDocument: visitorPluginCommon.getConfigValue(rawConfig.exposeDocument, false),
            exposeQueryKeys: visitorPluginCommon.getConfigValue(rawConfig.exposeQueryKeys, false),
            exposeFetcher: visitorPluginCommon.getConfigValue(rawConfig.exposeFetcher, false),
        });
        this.rawConfig = rawConfig;
        this.reactQueryIdentifiersInUse = new Set();
        this.queryMethodMap = {
            query: {
                hook: 'useQuery',
                options: 'UseQueryOptions',
            },
            mutation: {
                hook: 'useMutation',
                options: 'UseMutationOptions',
            },
        };
        this._externalImportPrefix = this.config.importOperationTypesFrom ? `${this.config.importOperationTypesFrom}.` : '';
        this._documents = documents;
        this.fetcher = this.createFetcher(rawConfig.fetcher || 'fetch');
        autoBind(this);
    }
    get imports() {
        return this._imports;
    }
    createFetcher(raw) {
        if (raw === 'fetch') {
            return new FetchFetcher(this);
        }
        else if (typeof raw === 'object' && 'endpoint' in raw) {
            return new HardcodedFetchFetcher(this, raw);
        }
        else if (raw === 'graphql-request') {
            return new GraphQLRequestClientFetcher(this);
        }
        return new CustomMapperFetcher(this, raw);
    }
    get hasOperations() {
        return this._collectedOperations.length > 0;
    }
    getImports() {
        const baseImports = super.getImports();
        if (!this.hasOperations) {
            return baseImports;
        }
        return [...baseImports, `import { ${Array.from(this.reactQueryIdentifiersInUse).join(', ')} } from 'react-query';`];
    }
    getFetcherImplementation() {
        return this.fetcher.generateFetcherImplementaion();
    }
    _getHookSuffix(name, operationType) {
        if (this.config.omitOperationSuffix) {
            return '';
        }
        if (!this.config.dedupeOperationSuffix) {
            return changeCaseAll.pascalCase(operationType);
        }
        if (name.includes('Query') || name.includes('Mutation') || name.includes('Subscription')) {
            return '';
        }
        return changeCaseAll.pascalCase(operationType);
    }
    buildOperation(node, documentVariableName, operationType, operationResultType, operationVariablesTypes, hasRequiredVariables) {
        var _a, _b;
        const nodeName = (_b = (_a = node.name) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '';
        const suffix = this._getHookSuffix(nodeName, operationType);
        const operationName = this.convertName(nodeName, {
            suffix,
            useTypesPrefix: false,
            useTypesSuffix: false,
        });
        operationResultType = this._externalImportPrefix + operationResultType;
        operationVariablesTypes = this._externalImportPrefix + operationVariablesTypes;
        if (operationType === 'Query') {
            let query = this.fetcher.generateQueryHook(node, documentVariableName, operationName, operationResultType, operationVariablesTypes, hasRequiredVariables);
            if (this.config.exposeDocument) {
                query += `\nuse${operationName}.document = ${documentVariableName};\n`;
            }
            if (this.config.exposeQueryKeys) {
                query += generateQueryKeyMaker(node, operationName, operationVariablesTypes, hasRequiredVariables);
            }
            // The reason we're looking at the private field of the CustomMapperFetcher to see if it's a react hook
            // is to prevent calling generateFetcherFetch for each query since all the queries won't be able to generate
            // a fetcher field anyways.
            if (this.config.exposeFetcher && !this.fetcher._isReactHook) {
                query += this.fetcher.generateFetcherFetch(node, documentVariableName, operationName, operationResultType, operationVariablesTypes, hasRequiredVariables);
            }
            return query;
        }
        else if (operationType === 'Mutation') {
            return this.fetcher.generateMutationHook(node, documentVariableName, operationName, operationResultType, operationVariablesTypes);
        }
        else if (operationType === 'Subscription') {
            // eslint-disable-next-line no-console
            console.warn(`Plugin "typescript-react-query" does not support GraphQL Subscriptions at the moment! Ignoring "${node.name.value}"...`);
        }
        return null;
    }
}

const plugin = (schema, documents, config) => {
    const allAst = graphql.concatAST(documents.map(v => v.document));
    const allFragments = [
        ...allAst.definitions.filter(d => d.kind === graphql.Kind.FRAGMENT_DEFINITION).map(fragmentDef => ({
            node: fragmentDef,
            name: fragmentDef.name.value,
            onType: fragmentDef.typeCondition.name.value,
            isExternal: false,
        })),
        ...(config.externalFragments || []),
    ];
    const visitor = new ReactQueryVisitor(schema, allFragments, config, documents);
    const visitorResult = graphql.visit(allAst, { leave: visitor });
    if (visitor.hasOperations) {
        return {
            prepend: [...visitor.getImports(), visitor.getFetcherImplementation()],
            content: [visitor.fragments, ...visitorResult.definitions.filter(t => typeof t === 'string')].join('\n'),
        };
    }
    return {
        prepend: [...visitor.getImports()],
        content: [visitor.fragments, ...visitorResult.definitions.filter(t => typeof t === 'string')].join('\n'),
    };
};
const validate = async (schema, documents, config, outputFile) => {
    if (path.extname(outputFile) !== '.ts' && path.extname(outputFile) !== '.tsx') {
        throw new Error(`Plugin "typescript-react-query" requires extension to be ".ts" or ".tsx"!`);
    }
};

exports.ReactQueryVisitor = ReactQueryVisitor;
exports.plugin = plugin;
exports.validate = validate;
