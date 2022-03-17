import { getDocument, AstNodeDescription, AstNodeDescriptionProvider, AstNode, Scope, DefaultScopeProvider, StreamScope, stream} from 'langium';
import { Call, Def } from './generated/ast';
import { inspect } from 'util';
import { HelloWorldServices } from './hello-world-module';

export class MyScopeProvider extends DefaultScopeProvider {

    descriptionProvider: AstNodeDescriptionProvider;

    constructor(services: HelloWorldServices) {
        super(services);
        this.descriptionProvider = services.index.AstNodeDescriptionProvider;
    }

    getScope(node: AstNode, referenceId: string): Scope {
        console.log(`getScope ${referenceId}: ${node.$type}`);
        if (referenceId=="Call:methodref" && node.$type=='Call') {
            let definitions: Def[]|undefined = [];
            // next line breaks 'i1'/'i2' refs
            definitions = (node as Call).instance?.ref?.type?.ref?.defs;
            console.log(`definitions==${definitions}`);
            if (definitions!==undefined) {
                definitions.forEach( d => { console.log(`name==${d.name}`); });
                // solution suggested here: https://github.com/langium/langium/discussions/401
                const descriptions = stream(definitions).map(element =>
                    this.descriptionProvider.createDescription(element, element.name, getDocument(element)));
                return new StreamScope(descriptions);
            }
            else {
                const result = super.getScope(node, referenceId);
                return result;    
            }
        }
        else {
            const result = super.getScope(node, referenceId);
            return result;
        }
    }

}
