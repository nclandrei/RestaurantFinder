var restaurants_res = [];
var initial_res = [];
var criteria = new Object();
var cuisineTypes = [];

document.getElementById("postcode-go").addEventListener("click", function(type){
	$.ajax({
        url: "https://public.je-apis.com/restaurants?q="+$("#postcode").val(),
        dataType: 'json',
        type: "GET",
	headers: {
		"Accept-Tenant": "uk",
		"Accept-Language": "en-GB",
		"Authorization": "Basic VGVjaFRlc3RBUEk6dXNlcjI=",
		"Host": "public.je-apis.com"	

	},
    success: function (parsed_json) {
        parsed_json.Restaurants.forEach(function(entry) {
			restaurants_res.push(entry);
		});
		initial_res = restaurants_res;
		$("#res").empty();
		for(var restaurant of restaurants_res){
			for(var food of restaurant.CuisineTypes){
				if($.inArray(food.Name,cuisineTypes) == -1){
					cuisineTypes.push(food.Name);
				}
			}
			$("#res").append(JSON.stringify(restaurant.Name));
		}
		console.log(cuisineTypes);
		createCheckBoxes();
	}

});
	
});

//Checkbox selsects what type of cuisine you wish to view
function filterByCuisine(element){
	var new_res = [];
	if(!("cuisine" in criteria)){
		criteria["cuisine"] = element.value;
		for(var restaurant of restaurants_res){
			for(var cuisine of restaurant.CuisineTypes){
				if(JSON.stringify(cuisine.Name) === JSON.stringify(element.value)){
					new_res.push(restaurant);
					break;
				}
			}
		}
	}else{
		delete criteria["cuisine"];
		new_res = filterByList();
	}
	restaurants_res = new_res;
	$("#res").html("");
	for(var restaurant of restaurants_res){
		$("#res").append(JSON.stringify(restaurant.Name));
	}
}


//select whether the restaurant should be close by
function filterByIsClose(){
	var new_res = [];
	if(!("closeBy" in criteria)){
		criteria["closeBy"] = 2;
		for(var restaurant of restaurants_res){
			if(restaurant.IsCloseBy){
				new_res.push(restaurant);
			}
		}
	}else{
		delete criteria["closeBy"];
		new_res = filterByList();
	}
	restaurants_res = new_res;
	$("#res").html("");
	for(var restaurant of restaurants_res){
		$("#res").append(JSON.stringify(restaurant.Name));
	}
}

//iterates through the dictionary of applied filters
//and updates the array of restaurants accordingly
function filterByList(){
	restaurants_res = initial_res;
	if("cuisine" in criteria){
		var cuisine = criteria["cuisine"];
		delete criteria["cuisine"];
		filterByCuisine(document.getElementsByName(cuisine+"Check")[0]);
	}
	if("closeBy" in criteria){
		delete criteria["closeBy"];
		filterByIsClose();
	}
	if("openNow" in criteria){
		delete criteria["openNow"];
		filterByOpenNow();
	}
	return restaurants_res;
}

function filterByOpenNow(){
	var new_res = [];
	if(!("openNow" in criteria)){
		criteria["openNow"] = 2;
		for(var restaurant of restaurants_res){
			if(restaurant.IsOpenNow){
				new_res.push(restaurant);
			}
		}
	}else{
		delete criteria["openNow"];
		new_res = filterByList();
	}
	restaurants_res = new_res;
	$("#res").html("");
	for(var restaurant of restaurants_res){
		$("#res").append(JSON.stringify(restaurant.Name));
	}
}


//creates the checkboxes for food types
function createCheckBoxes(){
	for(var box of cuisineTypes){
		var x = document.createElement("input");
		var label = document.createElement("label");
		x.setAttribute("type", "checkbox");
		x.setAttribute("name", box + "Check");
		x.setAttribute("value", box);
		x.setAttribute("onClick","filterByCuisine(this)");
		label.innerHTML = box;
		label.appendChild(x);
		document.getElementById("checkBoxArea").appendChild(label);
	}
}
