
function setHeight (element)
{ 
  var result = document.getElementById("results");
  var h = parseInt(result.style.height);
  //document.getElementById("search_button").value += h;
  with (document.body.style)
	{
		//width = "500px";
		height = h + "px";
	}
}

function nothingFound()
{
    var ddg_result = document.getElementById("ddg_zeroclick");
    if (ddg_result !== null){
        ddg_result.innerHTML = 'No zero click results found.';
    }
}

function hideZeroClick()
{
    var ddg_result = document.getElementById("ddg_zeroclick");
    if (ddg_result !== null){
        ddg_result.style.display = 'none';
    }
}

function showZeroClick()
{
    var ddg_result = document.getElementById("ddg_zeroclick");
    if (ddg_result !== null){
        ddg_result.style.display = 'block';
    }
}


function createResultDiv()
{  
    var result = document.getElementById("results");
    var ddg_result = document.getElementById("ddg_zeroclick");
    showZeroClick();
    if (ddg_result === null) {
        result.innerHTML = '<div id="ddg_zeroclick"></div>';
        ddg_result = document.getElementById("ddg_zeroclick");
    }
    return ddg_result;
}

function displayAnswer(answer)
{
    if (answer === '') {
        return;
    }
    
    var ddg_result = createResultDiv();
    ddg_result.className = "ddg_answer";
    ddg_result.innerHTML = answer;
    setHeight(ddg_result);
}

function displaySummary(res, query) {
    var result = ''

    var img_url = res['AbstractURL'];
    var official_site = '';
    var first_category = ''
    var hidden_categories = '';


    if (res['Results'].length !== 0) {
        if(res['Results'][0]['Text'] === "Official site") {
            official_site = ' | ' + res['Results'][0]['Result'];
            img_url = res['Results'][0]['FirstURL'];
        }
    }
    

    for (var i = 0; i < res['RelatedTopics'].length; i++){
        if (res['RelatedTopics'].length === 0)
            break;
        
        var link = res['RelatedTopics'][i]['Result'].
                    match(/<a href=".*">.*<\/a>/);
        
        if (i < 2) {
            var first = (i === 0)? ' class="first_category"': '';
            first_category += '<div id="ddg_zeroclick_category"'+ first + '>' +
                                link +
                              '</div>';
        } else {
            hidden_categories += '<div id="ddg_zeroclick_category">' +
                                link +
                              '</div>';
        }
    }

    if (hidden_categories !== '') {
        hidden_categories = '<div id="ddg_zeroclick_more">' +
                                '<a href="javascript:;" onclick="' +
                                    "this.parentElement.style.display='none';" +
                                    "this.parentElement.nextElementSibling.style.display='block'" +
                                '"> More related topics </a>' +
                             '</div>' +
                                '<div style="display:none">' +
                                    hidden_categories +
                                '</div>';
    }


    result += '<div id="ddg_zeroclick_header">' +
                '<a href="' + res['AbstractURL'] + '">'+
                    (res['Heading'] === ''? "&nbsp;": res['Heading']) +
                '</a>' +
                '<a class="ddg_more" href="https://duckduckgo.com/?q='+
                    encodeURIComponent(query)
                +'"> See DuckDuckGo results </a>' +
                '</div>';
    
    if (res['Image']) {
        result += '<div id="ddg_zeroclick_image">' +
                    '<a href="' + img_url +'">' +
                        '<img class="ddg_zeroclick_img" src="' + res['Image'] +
                        '" />' +
                    '</a>' +
                  '</div>';
    }
    
    var source_base_url = res['AbstractURL'].match(/http.?:\/\/(.*?\.)?(.*\..*?)\/.*/)[2];

    result += '<div id="ddg_zeroclick_abstract">' + res['Abstract'] +
                '<div id="ddg_zeroclick_official_links">' +
                    '<img src="http://duckduckgo.com/i/'+ source_base_url +'.ico" />' +
                    '<a href="' + res['AbstractURL'] + '"> More at ' +
                        res['AbstractSource'] +
                    '</a>' + official_site +
                '</div>' +
                 first_category +
                 hidden_categories +
              '</div><div class="clear"></div>';


    var ddg_result = createResultDiv();
    ddg_result.className = '';
    ddg_result.innerHTML = result;
    setHeight(ddg_result);
}

function displayDisambiguation(res, query){
    
    var result = '';
    result += '<div id="ddg_zeroclick_header"> Meanings of ' +
                    res['Heading'] +

                '<a class="ddg_more" href="https://duckduckgo.com/?q='+
                    encodeURIComponent(query)
                +'"> See DuckDuckGo results </a>' +

              '</div>';

    var disambigs = ''
    var hidden_disambigs = '';
    var others = '';
    var nhidden = 0;

   for (var i = 0; i < res['RelatedTopics'].length; i++){
        if (res['RelatedTopics'].length === 0)
            break;

        // other topics
        if(res['RelatedTopics'][i]['Topics']) {
            var topics = res['RelatedTopics'][i]['Topics'];
            var output = '';
            for(var j = 0; j < topics.length; j++){
                output += '<div class="wrapper">' +
                            '<div class="icon_disambig">' +
                                '<img src="' + topics[j]['Icon']['URL'] +'" />' +
                            '</div>' +
                            '<div class="ddg_zeroclick_disambig">' +
                                topics[j]['Result'] +
                            '</div>' +
                          '</div>';
            }
            others += '<div class="disambig_more">' +
                                '<a href="javascript:;" onclick="' +
                                    "this.parentElement.nextElementSibling.style.display='block';" +
                                    "this.parentElement.innerHTML = '" + res['RelatedTopics'][i]['Name'] + "<hr>';" +
                                '"> ' + res['RelatedTopics'][i]['Name'] + ' ('+ topics.length + ')</a>' +
                             '</div>' +
                                '<div style="display:none">' +
                                    output +
                                '</div>';
            

            continue;
        }
            
 
        if (i <= 2) {
            disambigs += '<div class="wrapper">' +
                            '<div class="icon_disambig">' +
                                '<img src="' + res['RelatedTopics'][i]['Icon']['URL'] +'" />' +
                            '</div>' +
                            '<div class="ddg_zeroclick_disambig">' +
                                res['RelatedTopics'][i]['Result'] +
                            '</div>' +
                          '</div>';
        } else {
            hidden_disambigs += '<div class="wrapper">' +
                                    '<div class="icon_disambig">' +
                                        '<img src="' + res['RelatedTopics'][i]['Icon']['URL'] +'" />' +
                                    '</div>' +
                                    '<div class="ddg_zeroclick_disambig">' +
                                        res['RelatedTopics'][i]['Result'] +
                                    '</div>' +
                                  '</div>';
            nhidden++;
        }
    }
    
    if (hidden_disambigs!== '') {
        hidden_disambigs = '<div class="disambig_more">' +
                                '<a href="javascript:;" onclick="' +
                                    "this.parentElement.style.display='none';" +
                                    "this.parentElement.nextElementSibling.style.display='block'" +
                                '"> More ('+ nhidden + ')</a>' +
                             '</div>' +
                                '<div style="display:none">' +
                                    hidden_disambigs+
                                '</div>';
    }


    result += '<div id="ddg_zeroclick_abstract">' +
                  disambigs +
                  hidden_disambigs +
                  others +
              '</div><div class="clear"></div>';
              

    var ddg_result = createResultDiv();
    ddg_result.className = '';
    ddg_result.innerHTML = result;
    setHeight(ddg_result);
}

function displayCategory(res, query){
    var result = '';
    result += '<div id="ddg_zeroclick_header">' +
                    res['Heading'] +
                '<a class="ddg_more" href="https://duckduckgo.com/?q='+
                    encodeURIComponent(query)
                +'"> See DuckDuckGo results </a>' +
              '</div>';
    
    var categories = '';
    var hidden_categories = '';
    var nhidden = 0;
    for (var i = 0; i < res['RelatedTopics'].length; i++){
        if (res['RelatedTopics'].length === 0)
            break;

        if (i <= 2) {
            categories += '<div class="wrapper">' +
                            '<div id="ddg_zeroclick_img" class="icon_category">' +
                                '<img src="' + res['RelatedTopics'][i]['Icon']['URL'] +'" />' +
                            '</div>' +
                            '<div id="ddg_zeroclick_category_item">' +
                                res['RelatedTopics'][i]['Result'] +
                            '</div>' +
                          '</div>';
        } else {
            hidden_categories += '<div class="wrapper">' +
                                '<div id="ddg_zeroclick_img" class="icon_category">' +
                                    '<img src="' + res['RelatedTopics'][i]['Icon']['URL'] +'" />' +
                                '</div>' +
                                '<div id="ddg_zeroclick_category_item">' +
                                    res['RelatedTopics'][i]['Result'] +
                                '</div>' +
                              '</div>';

            nhidden++;
        }

    }
    
    if (hidden_categories !== '') {
        hidden_categories = '<div class="category_more">' +
                                '<a href="javascript:;" onclick="' +
                                    "this.parentElement.style.display='none';" +
                                    "this.parentElement.nextElementSibling.style.display='block'" +
                                '"> More ('+ nhidden + ')</a>' +
                             '</div>' +
                                '<div style="display:none">' +
                                    hidden_categories+
                                '</div>';
 
    }

    result += '<div id="ddg_zeroclick_abstract">' +
                    categories +
                    hidden_categories +
                '</div>';
                
    

    var ddg_result = createResultDiv();
    ddg_result.className = '';
    ddg_result.innerHTML = result;
    setHeight(ddg_result);
}

function renderZeroClick(res, query)
{
    // disable on images
    if (document.getElementById('isr_pps') !== null)
        return;

    if (res['AnswerType'] !== "") {
        displayAnswer(res['Answer']);
    } else if (res['Type'] == 'A' && res['Abstract'] !== "") {
        displaySummary(res, query);
    } else {
        switch (res['Type']){
            case 'E':
                displayAnswer(res['Answer']);
                break;

            case 'A':
                displayAnswer(res['Answer']);
                break;

            case 'C':
                displayCategory(res, query);
                break;

            case 'D':
                displayDisambiguation(res, query);
                break;

            default:
                createResultDiv();
                nothingFound();
                break;
                    
        }
    }
}

function query(q, callback){
  var req = new XMLHttpRequest();
  req.open('GET', 'http://api.duckduckgo.com?q=' + encodeURIComponent(q) + '&format=json', true);

  req.onreadystatechange = function(data) {
      if (req.readyState != 4) { return; }
      var res = JSON.parse(req.responseText);
      callback(res);
  }
  req.send(null);
}

function search(q){   
    query(q, function(response){
        renderZeroClick(response, q);
    });
}


window.onload = function(){
  document.getElementById("search_button").onclick = function(){
    var el = document.getElementById('search_wrapper');
    if (el.value !== '')
        search(el.value);
    else
        return false;
  };
}


