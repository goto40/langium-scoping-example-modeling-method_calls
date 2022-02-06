# langium-scoping-example-modeling-method_calls
a simple example based on https://goto40.github.io/self-dsl/xtext_scoping/

Grammar:
```
...
Model: packages+=Pack*;
Pack: 'package' name=ID '{' 
    (class+=Class | instances+=Instance | calls+=Call)* 
    '}';
Class: 'class' name=ID "{" defs+=Def* "}";
Def: 'def' name=ID;
Instance: 'instance' name=ID ':' type=[Class|FQN];
Call: 'call' instance=[Instance|FQN] '->' ref=[Def];
...
```

Example Model:
```
package p1 {
    class C1 {
        def a1
    }
    class C2 {
        def b1
    }
    instance i1: C1
    instance i2: C2
    call i1->a1
    call i2->b1
}
```