$(document).ready(function(){
  console.log("loaded");
$('#pCard-text').hide();

  var getData = function(poemTitle){
  var poemUrl = "http://poetrydb.org/author,title/Walt Whitman;" + poemTitle;
  $.ajax({
  url: poemUrl,
  method: "GET",
  success: function(poemUrl) {
    console.log(poemUrl);
handleResponse(poemUrl);
    }
  });
};


  var appendPoem = function(title, lines){
    $("#poemDisplay").
    html
("<form method='POST' action='/notes'><div class='col-md-12'><textarea id = 'poemTitle' name='poemTitle'>"
  + title + "</textarea></div><div class='col-md-12'><textarea id ='poemText' name='poemText'>" + lines
  + "</textarea></div><div class='col-md-12'><textarea id='handle' placeholder='Your Handle'></textarea></div><div class='col-md-12'><textarea id='notes' placeholder='Your Notes'></textarea></div><button type='submit'>Submit</button></form>");
      $('#poemTitle').prop('readonly', true);
      $('#poemText').prop('readonly', true);
    };

  var addAJAXFunction = function(){
    $("#searchButton").click(function(){
      var poemTitle = $("input").val();
      getData(poemTitle);
    });
    $('#searchButton').click(
    function(){
        $('input').val('');

    });
 };




  var handleResponse = function(data){
    var data = data[0]
    var title = data.title;
    var lines = data.lines.toString();
    console.log(title)
    console.log(lines)
    appendPoem(title, lines);
    };




addAJAXFunction();

});
