grammar HelloWorld

entry Model: packages+=Pack*;
Pack: 'package' name=ID '{' 
    (class+=Class | instances+=Instance | calls+=Call)* 
    '}';
Class: 'class' name=ID "{" defs+=Def* "}";
Def: 'def' name=ID;
Instance: 'instance' name=ID ':' type=[Class:FQN];
Call: 'call' instance=[Instance:FQN] '->' methodref=[Def:ID];

FQN returns string hidden(): ID ('.' ID)*;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
