$(document).ready(function(){
  console.log("loaded");
$('.pCard-text').hide();
$('.aCard-text').hide();
$(function(){
    $('.seePoem').on('click',function(){
        $('.pCard-text').toggle();
    });
})


$(function(){
    $('.seeAnalysis').on('click',function(){
        $('.aCard-text').toggle();
    });
})

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
  ("<form method='POST' action='/analyses'><div class='col-md-12'><textarea name='poem_title' id='poem_title'>" +
  title + "</textarea></div><div class='col-md-12'><textarea name='poem_text' id='poem_text'>" + lines +
  "</textarea></div><div class='col-md-12'><textarea name='handle' id='handle' placeholder='Handle'></textarea></div><div class='col-md-12'><textarea name='note_text' id='note_text' placeholder='Analysis'></textarea></div><br><button class='btn btn-default' type='submit'>Submit</button></form>");
      $('#poem_title').prop('readonly', true);
      $('#poem_text').prop('readonly', true);
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

addAJAXFunction();


  var handleResponse = function(data){
    var data = data[0]
    var title = data.title;
    var lines = data.lines.toString();
    console.log(title)
    console.log(lines)
    appendPoem(title, lines);
    };






});
