// $('#some_id').cmd({
//     prompt: '$>',
//     width: '100%',
//     commands: function(command, term) {
// 	    if (command == 'test') {
// 	        term.echo("you just typed 'test'");
// 	    } else {
// 	        term.echo('unknown command');
// 	    }
//     }
// });

// $('#some_id').terminal(test_command, { prompt: '>', name: 'test' });

// function test_command(command, term) {
// 	console.log(this);
// 	console.log(term);
//     if (command == 'test') {
//         term.echo("you just typed 'test'");
//     } else {
//         term.echo('unknown command');
//     }
// }

jQuery(function($, undefined) {
    $('#some_id').terminal(function(command, term) {
        if (command !== '') {
            try {
                var result = window.eval(command);
                if (result !== undefined) {
                    term.echo(new String(result));
                }
            } catch(e) {
                term.error(new String(e));
            }
        } else {
           term.echo('');
        }
    }, {
        greetings: 'Javascript Interpreter',
        name: 'js_demo',
        height: 400,
        prompt: 'js> '
    });
});