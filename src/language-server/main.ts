import { startLanguageServer } from 'langium';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node';
import { createHelloWorldServices } from './hello-world-module';

const connection = createConnection(ProposedFeatures.all);
const { shared } = createHelloWorldServices({ connection });
startLanguageServer(shared);