var query;
//var text = '{"query":"microsoft", "interpretations":[{  "logprob" : -11.279,  "parse":"<rule name=\"#GetPapers\"><attr name=\"academic#AA.AfN\">microsoft</attr></rule>",  "rules":[  {    "name":"#GetPapers",    "output":      {       "type":"query",      "value":"Composite(AA.AfN=="microsoft")"    }  }  ]}]}';
//var obj=JSON.parse(text);
//var composite = obj.interpretations[0].rules[0].output.value;

$(document).ready(function() {
	$("#submitbtn").click(function() {
		query = $("#my-query").val();
		console.log(query);
		var expr = getInterpret(query);
	})
	
})



function getInterpret(query, model="latest", complete=0, count=10, offset=0, timeout=1000) {
	var returndata;
	$.ajax({
		url:"https://api.projectoxford.ai/academic/v1.0/interpret",
		headers: {
        'Ocp-Apim-Subscription-Key':'d7c08a20ed124371805bd6ac7afca6af'
    	},
    	data: { 'query': query,'count': count, 'offset': offset, 'complete': 0 },
		type:"GET",
		'success':  function (data) {
			console.log(data)
			returndata = data.interpretations[0].rules[0].output.value
			getEvaluate(returndata) 
		}	
	});
	return returndata;
}



function getEvaluate(expr, model="latest", attribute="Id,CC", count=10, offset=0, orderBy="name:desc") {
	$.ajax({
		url:"https://api.projectoxford.ai/academic/v1.0/evaluate?",
		headers: {
        'Ocp-Apim-Subscription-Key':'d7c08a20ed124371805bd6ac7afca6af'
    	},
    	data: { 'expr': expr,'count': count, 'attributes' : "Ti,Y,CC", 'offset': offset },
		type:"GET",
		'success':  function (data) {
			console.log(data)
		}	
	})

}