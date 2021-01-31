let restaurantData=[];
let currentRestaurant = {};
let page = 1;
const perPage = 10;
var map = null;

let avg = function(grades){
    let total = 0;
    console.log(total);
    grades.forEach(function(grade){
        total += grade.score;
        
    });
    
    let avg = (total/grades.length);
    console.log(avg);
    return avg.toFixed(2);
}

const tableRows = 

_.template(
    `<% _.forEach(restaurantData, function(restaurant){%>
        <tr data-id=<%- restaurant._id %>>
        <td><%- restaurant.name %></td>
        <td><%- restaurant.cuisine %></td>
        <td><%- restaurant.address.building %> <%- restaurant.address.street %></td>
        <td><%- avg(restaurant.grades) %></td>
        </tr>    
        <%}); 
    %>`
    );

let loadRestaurantData = function(){
    let templateResult;
    fetch(`https://sleepy-caverns-66631.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`)
    .then(response=> response.json())
    .then(data => {
        restaurantData = data;
        
        console.log(restaurantData);
        
        templateResult = tableRows({'restaurantData': restaurantData});
        
        $("#restaurant-table tbody").html(templateResult);
        $("#current-page").html(`${page}`);
    });
};
//tr element onclick
$(function(){
    loadRestaurantData();
    $(".table").on("click", "tr", function(){ 
        let currentID = $(this).attr("data-id");
        //console.log("current ID value: ", currentID);
/*         restaurantData.forEach(restaurant=>{
            if(restaurant._id === currentID){
                currentRestaurant = restaurant;
            }
        }); */
        currentRestaurant = _.find(restaurantData, function(restaurant){
            return restaurant._id === currentID;
        });
        $(".modal-title").html(currentRestaurant.name);
    
        $("#restaurant-address").html(currentRestaurant.address.building + ", " + currentRestaurant.address.street);
    
        $("#restaurant-modal").modal('show');
    });
    
    //test my click event
    //$("#restaurant-table tbody").on("click", "tr").css("background-color", "blue");
    //previous page onclick
    
    $("#previous-page").on("click", function(){
        if(page > 1){
            page -= 1;
            loadRestaurantData();
        }
        //else do nothing?
    });
    
    //next page onclick
    $("#next-page").on("click", function(){
        if(page >= 0){
            page += 1;
            loadRestaurantData();
        }
        //else do nothing?
    });
    
    //shown bs modal event
    $('#restaurant-modal').on('shown.bs.modal', function () {
        map = new L.Map('leaflet', {
            center: [currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]],
            zoom: 18,
            layers: [
            new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
            ]
           });
    });
    
    //hidden bs modal
    $('#restaurant-modal').on('hidden.bs.modal', function () {
        map.remove();
    });

})
