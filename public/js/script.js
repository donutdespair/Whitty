$(document).ready(function(){
  console.log("loaded");
$('.pCard-text').hide();
$('.aCard-text').hide();
$('.inputForm').hide();
$('#note_textR').prop('readonly', true);
$('#poem_text').prop('readonly', true);

$("button").click(function(){
   $(this).next().toggle()
   $("textarea").removeClass('hidden');
});

$("editAnalysis").click(function(){
     $("textarea").removeClass('hidden');
   });


  var getData = function(poemTitle){
  var poemObj = "/api";
  $.ajax({
  url: poemObj,
  method: "GET",
  dataType: 'JSON',
  data: { value: poemTitle },
  success: function(poemObj) {
  console.log(poemObj);
handleResponse(poemObj);
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
    var title = data.title;
    var lines = data.lines.toString();
    //console.log(title)
    //console.log(lines)
    appendPoem(title, lines);
    };
});
