<template>
  <div>
    <div>
      <input id="address" type="textbox" value="Sydney, NSW" />
      <input type="button" value="Encode" @click="codeAddress" />
    </div>
    <div id="map" style="height: 480px"></div>
  </div>
</template>

<script>
import Vue from "vue";
var geocoder;
var map;
export default Vue.extend({
  auth: false,
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(-34.397, 150.644);
      var mapOptions = {
        zoom: 8,
        center: latlng,
      };
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
    },

    codeAddress() {
      var address = document.getElementById("address").value;
      geocoder.geocode({ address: address }, function (results, status) {
        if (status == "OK") {
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
          });
        } else {
          alert(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
    },
  },
});
</script>

<style></style>
