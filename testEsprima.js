var esprima = require('esprima');
var syntax = esprima.parse('function testFunc(param){ \
                            var testVar = 24, doTestVar; \
                            testVar = testVar +2; \
                            if( testVar ) test(doTestVar); \
                            } \
                            testOutOfScopVar = 25;');

// get unused vars for specific function
function getUnusedVarsForFunction( functionObj ){
    var varArray = [];
    // add parameters
    for( var i = 0; i < functionObj.params.length; i++ ){
        varArray.push( functionObj.params[i].name );
    }
    // add declared variables
    for( var i = 0; i < functionObj.body.body.length; i++ ){
        if( functionObj.body.body[i].type === 'VariableDeclaration' ){
            for( var j = 0; j < functionObj.body.body[i].declarations.length; j++ ){            
                var tmp = functionObj.body.body[i].declarations[j];
                if( tmp.type === 'VariableDeclarator' ){
                    varArray.push( tmp.id.name );
                }
            }
        }
    }
    //
    console.log( 'Variables: ' + varArray );
    
    // go through function body and remove used variables;
    for( var i = 0; i < functionObj.body.body.length; i++ ){
        if( functionObj.body.body[i].type === 'ExpressionStatement' ){
            var strExpression = JSON.stringify( functionObj.body.body[i] );
            for( var j = 0; j < varArray.length; j++ ){                
                if( strExpression.match( "\"" + varArray[j] + "\"" ) )
                    varArray.splice( i );
            }
        }
    }
    
    
    return varArray;
}


function testUnusedVarsJSON( syntax, functionName ){
   // console.log( JSON.stringify( syntax, undefined, 2 ) );
    for( var i = 0; i < syntax.body.length; i++ ){
        if( ( syntax.body[i].type === 'FunctionDeclaration' ) && syntax.body[i].id.name === functionName ){
            console.log( 'corect function ' );
            return getUnusedVarsForFunction( syntax.body[i] );
        }
    }
    
 //   for( var item in jsonSyntax.body ){
   //     if( console.log( item ) );
    //}
}

console.log( testUnusedVarsJSON( syntax, 'testFunc' ) );
//console.log( JSON.stringify( syntax, undefined, 2 ) ); 