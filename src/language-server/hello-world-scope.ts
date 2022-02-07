import { getDocument, AstNodeDescription, AstNodeDescriptionProvider, AstNode, Scope, DefaultScopeProvider, SimpleScope, stream} from 'langium';
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
        if (referenceId=="Call:methodref" && node.$type=='Call') {
            let definitions: Def[]|undefined = [];
            definitions = (node as Call).instance?.ref?.type?.ref?.defs;
            console.log(`definitions==${definitions}`);
            if (definitions!=undefined) {
                definitions.forEach( d => { console.log(`name==${d.name}`); });
                // solution suggested here: https://github.com/langium/langium/discussions/401
                const descriptions = stream(definitions).map(element =>
                    this.descriptionProvider.createDescription(element, element.name, getDocument(element)));
                return new SimpleScope(descriptions);
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
