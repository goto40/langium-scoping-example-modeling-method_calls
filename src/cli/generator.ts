import fs from 'fs';
import { CompositeGeneratorNode, NL, processGeneratorNode } from 'langium';
import { Model } from '../language-server/generated/ast';
import { extractAstNode, extractDestinationAndName } from './cli-util';
import path from 'path';
import colors from 'colors';
import { createHelloWorldServices } from '../language-server/hello-world-module';
import { HelloWorldLanguageMetaData } from '../language-server/generated/module';

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createHelloWorldServices().helloworld;
    const helloworld = await extractAstNode<Model>(fileName, services);
    const generatedDirPath = generateJavaScript(helloworld, fileName, opts.destination);
    console.log(colors.green(`Java classes generated successfully: ${colors.yellow(generatedDirPath)}`));
};

export type GenerateOptions = {
    destination?: string;
    root?: string;
}

export function generateJavaScript(model: Model, filePath: string, destination?: string): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    const fileNode = new CompositeGeneratorNode();
    fileNode.append('"use strict";', NL, NL);
    // model.greetings.forEach(greeting => fileNode.append(`console.log('Hello, ${greeting.person.$refText}!');`, NL));

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, processGeneratorNode(fileNode));
    return generatedFilePath;
}
