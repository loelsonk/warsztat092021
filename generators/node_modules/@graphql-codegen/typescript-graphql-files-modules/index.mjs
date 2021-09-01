import { relative, basename } from 'path';

const plugin = async (schema, documents, { modulePathPrefix = '', relativeToCwd, prefix = '*/', type = 'DocumentNode' }) => {
    const useRelative = relativeToCwd === true;
    const mappedDocuments = documents.reduce((prev, documentRecord) => {
        const fileName = useRelative
            ? relative(process.cwd(), documentRecord.location)
            : basename(documentRecord.location);
        if (!prev[fileName]) {
            prev[fileName] = [];
        }
        prev[fileName].push(...documentRecord.document.definitions.filter(document => document.kind === 'OperationDefinition' || document.kind === 'FragmentDefinition'));
        return prev;
    }, {});
    return Object.keys(mappedDocuments)
        .filter(fileName => mappedDocuments[fileName].length > 0)
        .map(fileName => {
        const operations = mappedDocuments[fileName];
        return `
declare module '${prefix}${modulePathPrefix}${fileName}' {
  ${type === 'DocumentNode' ? `import { DocumentNode } from 'graphql';` : ''}
  const defaultDocument: ${type};
  ${operations
            .filter(d => d.name && d.name.value)
            .map(d => `export const ${d.name.value}: ${type};`)
            .join('\n')}

  export default defaultDocument;
}
    `;
    })
        .join('\n');
};
const validate = async (schema, documents, config, outputFile) => {
    if (!outputFile.endsWith('.d.ts')) {
        throw new Error(`Plugin "typescript-graphql-files-modules" requires extension to be ".d.ts"!`);
    }
};

export { plugin, validate };
