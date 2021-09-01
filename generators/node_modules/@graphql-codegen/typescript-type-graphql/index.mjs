import { getCachedDocumentNodeFromSchema } from '@graphql-codegen/plugin-helpers';
import { GraphQLEnumType, visit } from 'graphql';
import { DeclarationBlock, indent } from '@graphql-codegen/visitor-plugin-common';
import autoBind from 'auto-bind';
import { TsVisitor, TypeScriptOperationVariablesToObject, includeIntrospectionDefinitions } from '@graphql-codegen/typescript';
export { TsIntrospectionVisitor } from '@graphql-codegen/typescript';

const MAYBE_REGEX = /^Maybe<(.*?)>$/;
const ARRAY_REGEX = /^Array<(.*?)>$/;
const SCALAR_REGEX = /^Scalars\['(.*?)'\]$/;
const GRAPHQL_TYPES = ['Query', 'Mutation', 'Subscription'];
const SCALARS = ['ID', 'String', 'Boolean', 'Int', 'Float'];
const TYPE_GRAPHQL_SCALARS = ['ID', 'Int', 'Float'];
function escapeString(str) {
    return ("'" +
        String(str || '')
            .replace(/\\/g, '\\\\')
            .replace(/\n/g, '\\n')
            .replace(/'/g, "\\'") +
        "'");
}
function formatDecoratorOptions(options, isFirstArgument = true) {
    if (!Object.keys(options).length) {
        return '';
    }
    else {
        return ((isFirstArgument ? '' : ', ') +
            ('{ ' +
                Object.entries(options)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ') +
                ' }'));
    }
}
const FIX_DECORATOR_SIGNATURE = `type FixDecorator<T> = T;`;
function getTypeGraphQLNullableValue(type) {
    if (type.isNullable) {
        if (type.isItemsNullable) {
            return "'itemsAndList'";
        }
        else {
            return 'true';
        }
    }
    else if (type.isItemsNullable) {
        return "'items'";
    }
    return undefined;
}
class TypeGraphQLVisitor extends TsVisitor {
    constructor(schema, pluginConfig, additionalConfig = {}) {
        super(schema, pluginConfig, {
            avoidOptionals: pluginConfig.avoidOptionals || false,
            maybeValue: pluginConfig.maybeValue || 'T | null',
            constEnums: pluginConfig.constEnums || false,
            enumsAsTypes: pluginConfig.enumsAsTypes || false,
            immutableTypes: pluginConfig.immutableTypes || false,
            declarationKind: {
                type: 'class',
                interface: 'abstract class',
                arguments: 'class',
                input: 'class',
                scalar: 'type',
            },
            decoratorName: {
                type: 'ObjectType',
                interface: 'InterfaceType',
                arguments: 'ArgsType',
                field: 'Field',
                input: 'InputType',
                ...(pluginConfig.decoratorName || {}),
            },
            decorateTypes: pluginConfig.decorateTypes || undefined,
            ...(additionalConfig || {}),
        });
        autoBind(this);
        this.typescriptVisitor = new TsVisitor(schema, pluginConfig, additionalConfig);
        const enumNames = Object.values(schema.getTypeMap())
            .map(type => (type instanceof GraphQLEnumType ? type.name : undefined))
            .filter(t => t);
        this.setArgumentsTransformer(new TypeScriptOperationVariablesToObject(this.scalars, this.convertName, this.config.avoidOptionals, this.config.immutableTypes, null, enumNames, this.config.enumPrefix, this.config.enumValues));
        this.setDeclarationBlockConfig({
            enumNameValueSeparator: ' =',
        });
    }
    getDecoratorOptions(node) {
        const decoratorOptions = {};
        if (node.description) {
            // Add description as TypeGraphQL description instead of comment
            decoratorOptions.description = escapeString(node.description);
            node.description = undefined;
        }
        return decoratorOptions;
    }
    getWrapperDefinitions() {
        return [...super.getWrapperDefinitions(), this.getFixDecoratorDefinition()];
    }
    getFixDecoratorDefinition() {
        return `${this.getExportPrefix()}${FIX_DECORATOR_SIGNATURE}`;
    }
    buildArgumentsBlock(node) {
        const fieldsWithArguments = node.fields.filter(field => field.arguments && field.arguments.length > 0) || [];
        return fieldsWithArguments
            .map(field => {
            const name = node.name.value +
                (this.config.addUnderscoreToArgsType ? '_' : '') +
                this.convertName(field, {
                    useTypesPrefix: false,
                    useTypesSuffix: false,
                }) +
                'Args';
            if (this.hasTypeDecorators(name)) {
                return this.getArgumentsObjectTypeDefinition(node, name, field);
            }
            else {
                return this.typescriptVisitor.getArgumentsObjectTypeDefinition(node, name, field);
            }
        })
            .join('\n\n');
    }
    ObjectTypeDefinition(node, key, parent) {
        const isGraphQLType = GRAPHQL_TYPES.includes(node.name);
        if (!isGraphQLType && !this.hasTypeDecorators(node.name)) {
            return this.typescriptVisitor.ObjectTypeDefinition(node, key, parent);
        }
        const typeDecorator = this.config.decoratorName.type;
        const originalNode = parent[key];
        const decoratorOptions = this.getDecoratorOptions(node);
        let declarationBlock;
        if (isGraphQLType) {
            declarationBlock = this.typescriptVisitor.getObjectTypeDeclarationBlock(node, originalNode);
        }
        else {
            declarationBlock = this.getObjectTypeDeclarationBlock(node, originalNode);
            // Add type-graphql ObjectType decorator
            const interfaces = originalNode.interfaces.map(i => this.convertName(i));
            if (interfaces.length > 1) {
                decoratorOptions.implements = `[${interfaces.join(', ')}]`;
            }
            else if (interfaces.length === 1) {
                decoratorOptions.implements = interfaces[0];
            }
            declarationBlock = declarationBlock.withDecorator(`@TypeGraphQL.${typeDecorator}(${formatDecoratorOptions(decoratorOptions)})`);
        }
        return [declarationBlock.string, this.buildArgumentsBlock(originalNode)].filter(f => f).join('\n\n');
    }
    InputObjectTypeDefinition(node) {
        if (!this.hasTypeDecorators(node.name)) {
            return this.typescriptVisitor.InputObjectTypeDefinition(node);
        }
        const typeDecorator = this.config.decoratorName.input;
        const decoratorOptions = this.getDecoratorOptions(node);
        let declarationBlock = this.getInputObjectDeclarationBlock(node);
        // Add type-graphql InputType decorator
        declarationBlock = declarationBlock.withDecorator(`@TypeGraphQL.${typeDecorator}(${formatDecoratorOptions(decoratorOptions)})`);
        return declarationBlock.string;
    }
    getArgumentsObjectDeclarationBlock(node, name, field) {
        return new DeclarationBlock(this._declarationBlockConfig)
            .export()
            .asKind(this._parsedConfig.declarationKind.arguments)
            .withName(this.convertName(name))
            .withComment(node.description)
            .withBlock(field.arguments.map(argument => this.InputValueDefinition(argument)).join('\n'));
    }
    getArgumentsObjectTypeDefinition(node, name, field) {
        const typeDecorator = this.config.decoratorName.arguments;
        let declarationBlock = this.getArgumentsObjectDeclarationBlock(node, name, field);
        // Add type-graphql Args decorator
        declarationBlock = declarationBlock.withDecorator(`@TypeGraphQL.${typeDecorator}()`);
        return declarationBlock.string;
    }
    InterfaceTypeDefinition(node, key, parent) {
        if (!this.hasTypeDecorators(node.name)) {
            return this.typescriptVisitor.InterfaceTypeDefinition(node, key, parent);
        }
        const interfaceDecorator = this.config.decoratorName.interface;
        const originalNode = parent[key];
        const decoratorOptions = this.getDecoratorOptions(node);
        const declarationBlock = this.getInterfaceTypeDeclarationBlock(node, originalNode).withDecorator(`@TypeGraphQL.${interfaceDecorator}(${formatDecoratorOptions(decoratorOptions)})`);
        return [declarationBlock.string, this.buildArgumentsBlock(originalNode)].filter(f => f).join('\n\n');
    }
    buildTypeString(type) {
        if (!type.isArray && !type.isScalar && !type.isNullable) {
            type.type = `FixDecorator<${type.type}>`;
        }
        if (type.isScalar) {
            type.type = `Scalars['${type.type}']`;
        }
        if (type.isArray) {
            type.type = `Array<${type.type}>`;
        }
        if (type.isNullable) {
            type.type = `Maybe<${type.type}>`;
        }
        return type.type;
    }
    parseType(rawType) {
        const typeNode = rawType;
        if (typeNode.kind === 'NamedType') {
            return {
                type: typeNode.name.value,
                isNullable: true,
                isArray: false,
                isItemsNullable: false,
                isScalar: SCALARS.includes(typeNode.name.value),
            };
        }
        else if (typeNode.kind === 'NonNullType') {
            return {
                ...this.parseType(typeNode.type),
                isNullable: false,
            };
        }
        else if (typeNode.kind === 'ListType') {
            return {
                ...this.parseType(typeNode.type),
                isArray: true,
                isNullable: true,
            };
        }
        const isNullable = !!rawType.match(MAYBE_REGEX);
        const nonNullableType = rawType.replace(MAYBE_REGEX, '$1');
        const isArray = !!nonNullableType.match(ARRAY_REGEX);
        const singularType = nonNullableType.replace(ARRAY_REGEX, '$1');
        const isSingularTypeNullable = !!singularType.match(MAYBE_REGEX);
        const singularNonNullableType = singularType.replace(MAYBE_REGEX, '$1');
        const isScalar = !!singularNonNullableType.match(SCALAR_REGEX);
        const type = singularNonNullableType.replace(SCALAR_REGEX, (match, type) => {
            if (TYPE_GRAPHQL_SCALARS.includes(type)) {
                // This is a TypeGraphQL type
                return `TypeGraphQL.${type}`;
            }
            else if (global[type]) {
                // This is a JS native type
                return type;
            }
            else if (this.scalars[type]) {
                // This is a type specified in the configuration
                return this.scalars[type];
            }
            else {
                throw new Error(`Unknown scalar type ${type}`);
            }
        });
        return { type, isNullable, isArray, isScalar, isItemsNullable: isArray && isSingularTypeNullable };
    }
    fixDecorator(type, typeString) {
        return type.isArray || type.isNullable || type.isScalar ? typeString : `FixDecorator<${typeString}>`;
    }
    FieldDefinition(node, key, parent, path, ancestors) {
        const parentName = ancestors === null || ancestors === void 0 ? void 0 : ancestors[ancestors.length - 1].name.value;
        if (!this.hasTypeDecorators(parentName)) {
            return this.typescriptVisitor.FieldDefinition(node, key, parent);
        }
        const fieldDecorator = this.config.decoratorName.field;
        let typeString = node.type;
        const type = this.parseType(typeString);
        const decoratorOptions = this.getDecoratorOptions(node);
        const nullableValue = getTypeGraphQLNullableValue(type);
        if (nullableValue) {
            decoratorOptions.nullable = nullableValue;
        }
        const decorator = '\n' +
            indent(`@TypeGraphQL.${fieldDecorator}(type => ${type.isArray ? `[${type.type}]` : type.type}${formatDecoratorOptions(decoratorOptions, false)})`) +
            '\n';
        typeString = this.fixDecorator(type, typeString);
        return decorator + indent(`${this.config.immutableTypes ? 'readonly ' : ''}${node.name}!: ${typeString};`);
    }
    InputValueDefinition(node, key, parent, path, ancestors) {
        const parentName = ancestors === null || ancestors === void 0 ? void 0 : ancestors[ancestors.length - 1].name.value;
        if (parent && !this.hasTypeDecorators(parentName)) {
            return this.typescriptVisitor.InputValueDefinition(node, key, parent);
        }
        const fieldDecorator = this.config.decoratorName.field;
        const rawType = node.type;
        const type = this.parseType(rawType);
        const typeGraphQLType = type.isScalar && TYPE_GRAPHQL_SCALARS.includes(type.type) ? `TypeGraphQL.${type.type}` : type.type;
        const decoratorOptions = this.getDecoratorOptions(node);
        const nullableValue = getTypeGraphQLNullableValue(type);
        if (nullableValue) {
            decoratorOptions.nullable = nullableValue;
        }
        const decorator = '\n' +
            indent(`@TypeGraphQL.${fieldDecorator}(type => ${type.isArray ? `[${typeGraphQLType}]` : typeGraphQLType}${formatDecoratorOptions(decoratorOptions, false)})`) +
            '\n';
        const nameString = node.name.kind ? node.name.value : node.name;
        const typeString = rawType.kind
            ? this.buildTypeString(type)
            : this.fixDecorator(type, rawType);
        return decorator + indent(`${this.config.immutableTypes ? 'readonly ' : ''}${nameString}!: ${typeString};`);
    }
    EnumTypeDefinition(node) {
        if (!this.hasTypeDecorators(node.name)) {
            return this.typescriptVisitor.EnumTypeDefinition(node);
        }
        return (super.EnumTypeDefinition(node) +
            `TypeGraphQL.registerEnumType(${this.convertName(node)}, { name: '${this.convertName(node)}' });\n`);
    }
    clearOptional(str) {
        if (str.startsWith('Maybe')) {
            return str.replace(/Maybe<(.*?)>$/, '$1');
        }
        return str;
    }
    hasTypeDecorators(typeName) {
        if (GRAPHQL_TYPES.includes(typeName)) {
            return false;
        }
        if (!this.config.decorateTypes) {
            return true;
        }
        return this.config.decorateTypes.some(filter => filter === typeName);
    }
}

const TYPE_GRAPHQL_IMPORT = `import * as TypeGraphQL from 'type-graphql';\nexport { TypeGraphQL };`;
const isDefinitionInterface = (definition) => definition.includes('@TypeGraphQL.InterfaceType()');
const plugin = (schema, documents, config) => {
    const visitor = new TypeGraphQLVisitor(schema, config);
    const astNode = getCachedDocumentNodeFromSchema(schema);
    const visitorResult = visit(astNode, { leave: visitor });
    const introspectionDefinitions = includeIntrospectionDefinitions(schema, documents, config);
    const scalars = visitor.scalarsDefinition;
    const definitions = visitorResult.definitions;
    // Sort output by interfaces first, classes last to prevent TypeScript errors
    definitions.sort((definition1, definition2) => +isDefinitionInterface(definition2) - +isDefinitionInterface(definition1));
    return {
        prepend: [...visitor.getEnumsImports(), ...visitor.getWrapperDefinitions(), TYPE_GRAPHQL_IMPORT],
        content: [scalars, ...definitions, ...introspectionDefinitions].join('\n'),
    };
};

export { TypeGraphQLVisitor, plugin };
