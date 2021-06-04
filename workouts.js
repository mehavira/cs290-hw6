document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){

	var url = 'http://flip3.engr.oregonstate.edu:1240/';
	function reset_table(event){
		var req = new XMLHttpRequest();
		req.open('GET', url+'?rt=true', true);
        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                console.log('resetted table');
            }
            else{console.log('Error: '+req.statusText)}
        });
		req.send(null);
		event.preventDefault();
	}
	document.body.addEventListener('load', reset_table);

	function add_new_entry(event){
		var req = new XMLHttpRequest();
		var name = document.getElementById('entry_name');
		var reps = document.getElementById('entry_reps');
		var weight = document.getElementById('entry_weight');	
		var date = document.getElementById('entry_date');
		var unit = 'lbs';
		if (document.getElementById('entry_kg').checked){unit = 'kg'}
		var mod_url = url+'?insert=true&name='+name.value+'&reps='+reps.value+'&weight='+weight.value+'&date='+date.value+'&unit='+unit;
        console.log(mod_url);
		req.open('GET', mod_url, true);
        console.log('here');
		req.addEventListener('load', function(){
            console.log('addevent');
			if(req.status >= 200 && req.status < 400){
                console.log('success');
				 var response = JSON.parse(req.responseText);
				 var new_row_ind = Object.keys(response).length - 1;
				 var inptName = reponse[new_row_ind].name;
                 console.log(inptName);
				 var inptReps = response[new_row_ind].reps;
				 var inptWeight = response[new_row_ind].weight;
				 var inptDate = response[new_row_ind].date;
				 var inptUnit = response[new_row_ind].unit;	
				 var row_id = response[new_row_ind].id;
				 var new_row = document.createElement('tr');
				 new_row.id = row_id;
				 var inpts = [inptName, inptReps, inptWeight, inptDate, inptUnit];
				 for (var i=0; i < inpts.length; i++){
					var col = document.createElement('td');
					col.id = 'col'+i+''+row_id;
					col.textContent = inpts[i];
					new_row.appendChild(col);
				}
				var edit = document.createElement('input');
				edit.id = 'edit'+row_id;
				edit.type = 'submit';
				edit.value = 'Edit';
				
				var del = document.createElement('input');
				del.id = 'delete'+row_id;
				del.type = 'submit';
				del.value = 'Delete';
				
				edit.addEventListener('click', function(){
					document.getElementById('edit row').style.display = 'block';
					document.getElementById('row_id').value = new_row.id;
					document.getElementById('edit_name').value = inptName;
					document.getElementById('edit_reps').value = inptReps;
					document.getElementById('edit_weight').value = inptWeight;
					document.getElementById('edit_date').value = inptDate;
					document.getElementById('edit_unit').value = inptUnit;
					
				});

				del.addEventListener('click', function(event){
					var req = new XMLHttpRequest();
					var mod_url = url+'?del=true&rowid='+new_row.id;
					req.open('GET', mod_url, true);
					req.addEventListener('load', function(){
						if (req.status >= 200 && req.status < 400){
							document.getElementById(""+new_row.id).remove();
						}
						else {console.log('Error: '+req.statusText)}
					});	
                    req.send(null);
					event.preventDefault();
				});
				
				new_row.appendChild(edit);
				new_row.appendChild(del);
                document.getElementById('workout').appendChild(new_row);
	
		    }
            else{console.log('Error: '+req.statusText);}
	    }
        );
        req.send(null);
        event.preventDefault();

    }

	document.getElementById('add_submit').addEventListener('click', add_new_entry);
	
	function save_changes(event){
		var req = new XMLHttpRequest();
		var name = document.getElementById('edit_name');
		var reps = document.getElementById('edit_reps');
		var weight = document.getElementById('edit_weight');
		var date = document.getElementById('edit_date');
		var unit = 'lbs';
		var id = document.getElementById('row_id');
		if (document.getElementById('edit_kg').checked){unit = 'kg'}
		var mod_url = url+'?save=true&name='+name.value+'&reps='+reps.value+'&weight='+weight.value+'&date='+date.value+'&unit='+unit+'&id='+id.value;
		req.open('GET', mod_url, true);
		req.addEventListener('load', function(){
			if (req.status >= 200 && req.status < 400){
				var response = JSON.parse(req.responseText);
				var chosen = response[id.value-1]
				var changes = [chosen.name, chosen.reps, chosen.weight, chosen.date, chosen.unit];
				var row = document.getElementById('row_id');
				var cols = [];
				for (var i=0; i<5; i++){
					document.getElementById("col"+i+''+id.value).textContent = changes[i];
				}
			}
			else {console.log('Error: '+req.statusText)}
		});
		req.send(null);
		event.preventDefault();

	}
	document.getElementById('save_submit').addEventListener('click', save_changes);
}
