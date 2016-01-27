document.getElementById("postcode-go").addEventListener("click", function(){	
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
		                 
		        var restaurants_res = [];                                                   
	            parsed_json.Restaurants.forEach(function(entry) {		
					restaurants_res.push(entry);
		    	});

		    	onDataReady(restaurants_res);
		
				//$("#res").append(JSON.stringify(parsed_json));

	        },
	        error: function (e) {
	            alert('Failure ' + e.status);
	        },
	        done: function () {
	            alert('done');
	        }
		});
	});

	function onDataReady(data) {

    	var neededProc = data.length;
    	for (var i =0; i<data.length; i++){
    		//console.log(data[i].Postcode);
    		
    		var apiUrl = "http://maps.googleapis.com/maps/api/geocode/json?address=" + data[i].Postcode + "&sensor=false";



    		jQuery.getJSON( apiUrl, function( i, coo ) {
        		neededProc--;
        		data[i].latLng = coo.results[0].geometry.location;
        		if (neededProc == 0){
        			onCooRecieved(data);
        		}
      		}.bind(this, i));

    
    	}
	}

	function onCooRecieved(data){

		//TODO change this to searh bar addres
		var Glasgow = {lat: 55.852749, lng: -4.2209248};
    	var map = new google.maps.Map(document.getElementById('map'), {
      		center: Glasgow,
      		zoom: 12
    	});
		
		for (var i =0; i<data.length; i++){

			//edit contentString for the pop up info
			var contentString =  data[i].Name;

			var infoWindow = new google.maps.InfoWindow({content: contentString});

			var marker = new google.maps.Marker({
        		position: data[i].latLng,
        		map: map,
        		mapTypeId: google.maps.MapTypeId.TERRAIN
      		});

      		marker.addListener('click', function(marker, infoWindow) {
        		infoWindow.open(map, marker);
      		}.bind(this, marker, infoWindow));
		}
	}