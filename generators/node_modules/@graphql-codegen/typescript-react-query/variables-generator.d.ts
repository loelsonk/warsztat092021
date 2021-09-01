import { OperationDefinitionNode } from 'graphql';
export declare function generateQueryVariablesSignature(hasRequiredVariables: boolean, operationVariablesTypes: string): string;
export declare function generateQueryKey(node: OperationDefinitionNode): string;
export declare function generateQueryKeyMaker(node: OperationDefinitionNode, operationName: string, operationVariablesTypes: string, hasRequiredVariables: boolean): string;
