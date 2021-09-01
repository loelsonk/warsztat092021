import { Types, PluginFunction } from '@graphql-codegen/plugin-helpers';
import { TsIntrospectionVisitor } from '@graphql-codegen/typescript';
import { TypeGraphQLPluginConfig } from './config';
export * from './visitor';
export declare const plugin: PluginFunction<TypeGraphQLPluginConfig, Types.ComplexPluginOutput>;
export { TsIntrospectionVisitor };
