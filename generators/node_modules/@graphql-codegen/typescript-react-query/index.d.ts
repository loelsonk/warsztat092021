import { Types, PluginValidateFn, PluginFunction } from '@graphql-codegen/plugin-helpers';
import { ReactQueryVisitor } from './visitor';
import { ReactQueryRawPluginConfig } from './config';
export declare const plugin: PluginFunction<ReactQueryRawPluginConfig, Types.ComplexPluginOutput>;
export declare const validate: PluginValidateFn<any>;
export { ReactQueryVisitor };
