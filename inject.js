console.log("Injected");

function waitForMonaco() {
    const editors = window.lcMonaco?.editor?.getEditors?.();

    if (editors?.length) {
        const editor = editors[0];

        console.log("Editor found!");

        startSnippetEngine(editor);

        return;
    }

    setTimeout(waitForMonaco, 500);
}

const snippets = {
    ";for": `for(int i=0 ; i<n ; i++)
{
    $CURSOR$
}`,

    ";if": `if()
{
    $CURSOR$
}`,

    ";vec": `vector<int> v;$CURSOR$`
};



function startSnippetEngine(editor) {
    const indent = "    "
    const model = editor.getModel();
    editor.onKeyDown((e) => {

        if (e.browserEvent.key !== "Tab") {
            return;
        }

        const position = editor.getPosition();

        const line = model.getLineContent(
            position.lineNumber
        );

        const beforeCursor =
            line.slice(0, position.column - 1);
        const currentIndent = line.match(/^\s*/)[0];
        
        for (const trigger in snippets) {

            if (!beforeCursor.endsWith(trigger)) {
                continue;
             }

            console.log("Matched:", trigger);


            const range = new lcMonaco.Range(
                position.lineNumber,
                position.column - trigger.length,
                position.lineNumber,
                position.column
            );
            const snippet = snippets[trigger];

            const cursorMarker = "$CURSOR$";

            const cursorIndex =snippet.indexOf(cursorMarker);

            const finalSnippet =snippet.replace(cursorMarker, "");

            editor.executeEdits("snippet", [
            {
                range,
            text: finalSnippet
            }   
        ]);

        const beforeCursorText=snippet.slice(0, cursorIndex);

        const lines = beforeCursorText.split("\n");

        editor.setPosition({
        lineNumber:position.lineNumber + lines.length - 1,
        column:lines[lines.length - 1].length + 1
        });

        break;
        }   }
    );
}

waitForMonaco();