import { AstNodeDescription, AstNode, Scope, DefaultScopeProvider, SimpleScope, stream} from 'langium';
import { Call, Def } from './generated/ast';
import { inspect } from 'util';

export class MyScopeProvider extends DefaultScopeProvider {

    getScope(node: AstNode, referenceId: string): Scope {
        //console.log(`called for: ${referenceId}`);
        if (referenceId=="Call:methodref" && node.$type=='Call') {
            //console.log(`--> entered: ${referenceId}`);
            const scopes: AstNodeDescription[] = [];
            let definitions: Def[]|undefined = [];

            // (1) OK (does not help resolving "->a1" and "->b1", but does not break "i1" and "i2"):
            // console.log((node as Call).instance);

            // (2) breaks "i1"/"i2" reference in example: 
            // console.log((node as Call).instance?.ref);

            // (3) does not work and also breaks "i1" and "i2" resolution in the example
            //definitions = (node as Call).instance?.ref?.type?.ref?.defs;

            if (definitions) {
                definitions.forEach(element => {
                    //console.log(`adding scope element: ${inspect(element)}`);
                    scopes.push( { node: element, type: element.$type, name: element.name, documentUri:node.$document!.uri, path: ''} )
                });
                return new SimpleScope(stream(scopes));
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
