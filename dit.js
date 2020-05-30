function EditorAdapter( implementation ){
    this.editorImpl = implementation;
}

EditorAdapter.prototype.getContentString = function(){
    return this.editorImpl.getValue(); 
}

EditorAdapter.prototype.setContentString = function( contentString ){
    this.editorImpl.setValue( contentString );
}

function Dit( editor ){
    this.editor = editor;
}

Dit.prototype.getContentString = function(){
    return this.editor.getContentString();
}

Dit.prototype.setContentString = function( contentString ){
    return this.editor.setContentString( contentString );
}

var codeMirror = CodeMirror.fromTextArea(
    document.getElementById("editor_text"), {
        mode: "markdown",
        lineNumbers: true,
        theme: "default",
        extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
    }
);

var editorAdapter = new EditorAdapter( codeMirror );
var dit = new Dit( editorAdapter );

function generate() {
    document.getElementById("content").innerHTML = marked(dit.getContentString());
    KotlinPlayground('.language-kotlin');
}

function toogle(){
    var editorHtml = document.getElementById("dit");
    var editor_toogle_button = document.getElementById("editor_toogle_button");
    if (editorHtml.style.display == "none"){
        editorHtml.style.display = "block";
        editor_toogle_button.innerHTML = "Hide"
    }else{
        editorHtml.style.display = "none";
        editor_toogle_button.innerHTML = "Show"
    }
}

function save(){
    localStorage = window.localStorage;
    localStorage.setItem("dit_playground", dit.getContentString());
}

function init(){
    dit.setContentString(localStorage.getItem("dit_playground"));
}

window.onload = function() {
    init();
  };

  function buildList(data, isSub){
    var html = (isSub)?'<div>':''; // Wrap with div if true
    html += '<ul>';
    for(item in data){
        html += '<li>';
        if(typeof(data[item].sub) === 'object'){ // An array will return 'object'
            if(isSub){
                html += '<a href="' + data[item].link + '">' + data[item].name + '</a>';
            } else {
                html += data[item].id; // Submenu found, but top level list item.
            }
            html += buildList(data[item].sub, true); // Submenu found. Calling recursively same method (and wrapping it in a div)
        } else {
            html += data[item].id // No submenu
        }
        html += '</li>';
    }
    html += '</ul>';
    html += (isSub)?'</div>':'';
    return html;
}

