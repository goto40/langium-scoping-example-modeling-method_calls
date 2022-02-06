grammar HelloWorld
hidden(WS, SL_COMMENT, ML_COMMENT)

Model: packages+=Pack*;
Pack: 'package' name=ID '{' 
    (class+=Class | instances+=Instance | calls+=Call)* 
    '}';
Class: 'class' name=ID "{" defs+=Def* "}";
Def: 'def' name=ID;
Instance: 'instance' name=ID ':' type=[Class|FQN];
Call: 'call' instance=[Instance|FQN] '->' ref=[Def];

FQN returns string hidden(): ID ('.' ID)*;

terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;

terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
terminal SL_COMMENT: /\/\/[^\n\r]*/;
