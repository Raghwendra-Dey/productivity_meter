// Fetching the records from the Local Storage of the Browser

/*

{Records} is an/a Object/Dictionary of record keyed by their ID's.
Structure of record is to be as follows:

id : Unique id of the record such as the time in ms from Jan 1 1970 (NUM to a STRING) (KEY OF THE OBJECT)
name : Name of the record which is to be taken form user while saving a record (STRING)

time_recorded : Time at which the user confirms the record action (INTEGER)
time_devoted : Time devoted for the action (INTEGER)
time_actual : Actual time used (INTEGER)
time_wasted : Time Wasted by the user in that record (INTEGER)

List/Array of Todos:

    Where a Todo is of the structure below:
    
    name : Name of the todo (STRING)
    completed : Whether that todo is accomplished or not (BOOLEAN)

*/

// Following is a sample information which will later be connected to real data

let records = {
    "1234" : {
        id : "1234",
        name : "Algorithms Learning",
        time_recorded : 1000000000,
        time_devoted : 10000,
        time_actual : 8000,
        time_wasted : 2000,
        todos : [
            {
                name : "Text Book reading",
                completed : true
            },
            {
                name : "Problem Solving",
                completed : true
            }
        ]
    },
    "6987" : {
        id : "6987",
        name : "JS Projects",
        time_recorded : 1000000000,
        time_devoted : 10000,
        time_actual : 8000,
        time_wasted : 2000,
        todos : [
            {
                name : "Completing Works",
                completed : true
            },
            {
                name : "Sending PRs",
                completed : false
            }
        ]
    }
}

localStorage.setItem("records",JSON.stringify(records));

// End of Sample Data

records = JSON.parse(localStorage.getItem("records"));
let count = 0;

for (const record_id in records){
    let record_text =   $("#recordTemplate")
                            .html()
                            .replace(/@record_id@/g, records[record_id].id)
                            .replace(/@unique_key@/g, records[record_id].id)
                            .replace(/@name@/g, records[record_id].name)
                            .replace(/@record_time@/g, records[record_id].time_recorded)
                            .replace(/@devoted_time@/g, records[record_id].time_devoted)
                            .replace(/@used_time@/g, records[record_id].time_actual)
                            .replace(/@wasted_time@/g, records[record_id].time_wasted)
    if (count == 0) $("#records").html(record_text);
    else $("#records").append(record_text);

    let inside_count = 0;
    for (const task of records[record_id].todos){
        let task_text =   $("#taskTemplate")
                                .html()
                                .replace(/@record_id@/g, records[record_id].id)
                                .replace(/@task_enum@/g, inside_count+1)
                                .replace(/@task_name@/g, task.name)
                                .replace(/@completed@/g, task.completed ? "checked" : "")
        if (inside_count == 0) $("#record" + records[record_id].id + " .tasks").html(task_text);
        else $("#record" + records[record_id].id + " .tasks").append(task_text);
        inside_count++;
    }

    count++;
}

// Following is JQuery Code

// Initialisation of looks

let inSelectionMode = false;

$(".tasksBlock").hide();
$(".selectionCtrls").hide();
$(".recordTickLabel").hide();
$("#backDrop").hide();
$("#confirmation").hide();
$(".clickable").hide();

// Event Handlers
$(".toggler").click(function(){
	$(this).parent().siblings(".tasksBlock").slideToggle(100);
	
    if($(this).attr("pos") == 0)
    	$(this).css({'transform' : 'rotate('+ 180 +'deg)'});
    else
		$(this).css({'transform' : 'rotate('+ 0 +'deg)'});
		
    pos = $(this).attr("pos")
    $(this).attr("pos", 1 - pos)
})

// Entering Selection mode by clicking Select button
$("#selection>button").click(function(){
    inSelectionMode = true;
    $(".selectionCtrls").show();
    $("#selection").hide();
    $(".recordTickLabel").show();
    $(".clickable").show();
})

// Closing selection mode by clicking the close button
$(".selectionCtrls>.close").click(function(){
    inSelectionMode = false;
    $(".selectionCtrls").hide();
    $("#selection").show();
    $(".recordTickLabel").hide();
    $(this).siblings("input.selectAll").prop( "checked", false );
    $(".recordTickBox").prop( "checked", false );
    $(".clickable").hide();
})

// Select all checkbox Click event
$(".selectionCtrls>input.selectAll").click(function(){
    $(".recordTickBox").prop( "checked", $(this).prop("checked") );
})

// Select all button click event
$(".selectionCtrls>button.selectAll").click(function(){
    $(this).siblings("input.selectAll").prop( "checked", true );
    $(".recordTickBox").prop( "checked", true );
})

// delete event
$(".selectionCtrls>#delete").click(function(){
	
	// Initialising the Confirmation Box
    $("#confirmMatter").html("Are you sure want to delete?");
    $("#confirmYes").html("Yes, Delete");
    $("#confirmNo").html("No, Cancel");

    $("#backDrop").show();
	$("#confirmation").show();

	// Removes any delegated click event
	$("#confirmYes").unbind("click")

	// Registers a new click event
	$("#confirmYes").click(function(){
		$.each($(".recordTickBox"),function(i,value){
			let checkStatus = $(value).prop("checked")
			if(checkStatus){
				let key = $(value).parents(".record").attr("unique_key")
				$("#record"+key).remove();
				delete records[key]
			}
		})
		inSelectionMode = false;
		$(".selectionCtrls").toggle();
		$("#selection").toggle();
		$(".recordTickLabel").toggle();
		$(this).siblings("input.select_all").prop( "checked", false );
		$(".recordTickBox").prop( "checked", false );
		localStorage.setItem("records",JSON.stringify(records));
		if(JSON.stringify(records) === "{}")
			$("#records").text("\
			No Records Found.\
			Please make sure that you have used this app in this device before tracking for records.");
		$(".clickable").hide();
		$("#backDrop").hide();
		$("#confirmation").hide();
	})
	
	$("#confirmNo").click(function(){
		$("#backDrop").hide();
		$("#confirmation").hide();
	})
})

$("#backDrop").click(function(){
    $("#backDrop").hide();
    $("#confirmation").hide();
})

$(".clickable").click(function(){
    if(inSelectionMode){
        let status = $(this).siblings(".recordDetails").find(".recordTickBox").prop( "checked");
        $(this).siblings(".recordDetails").find(".recordTickBox").prop( "checked" , !status);  
    }
})

// Long press detection
// Set the duration of the long press and declare a couple variables
var longpress = 500;
var start;
var divMouseDown;                       

$(".record").on('mousedown', function(e){
    // Get the time it was clicked
    start = new Date().getTime();
	element = this
	
    // See if mouse is still being held down after the longpress duration
    divMouseDown = setTimeout(function(){
        // What we want to happen when mouse is clicked and held for 1 second
        inSelectionMode = true;
        $(".selectionCtrls").show();
        $("#selection").hide();
        $("#delete").show();
        $(".recordTickLabel").show();
        $(".clickable").show();
        $(element).find(".recordTickBox").prop( "checked" , true);
    }, longpress);
    
    // If the mouse leaves the element or is released before the long touch event, 
    // reset variables and stop the function from triggering          
    $(".record").on('mouseup mouseleave', function(){
        if (divMouseDown) {
            clearTimeout(divMouseDown);
        }
        start = 0;
        e.stopPropagation();
    } );
    
} );

