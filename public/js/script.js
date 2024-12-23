const socket = io();


if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        //getting lat , log from position.coords-
        const {latitude, longitude} = position.coords;
        //send msg-
        socket.emit("send-location", {latitude, longitude})
    }, (error)=>{
        console.error("Error with Geolocation:", error)
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
);
    

}

//getting map for set the view-
const map = L.map("map").setView([0,0], 16);

//showing map-
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

    attribution: "himna homes"

}).addTo(map);

const markers = {};

//receive location-
socket.on("recieve-location", (data)=>{
    const { id, latitude, longitude, } = data
    //set this view on a map-
    map.setView([latitude,longitude])
    //if marker id exists-
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }
    else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
}); 

//disconnect user-
socket.on("user-disconnected", (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }

});