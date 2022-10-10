<template>
  <div>
    <div class="section property_upload">
      <div v-if="step === 1">
        <div class="map_container">
          <div id="map" ref="map"></div>
          <div class="mt-20">
            <input
              id="address"
              class="controls"
              ref="search"
              type="textbox"
              :value="searched"
            />
            <button @click="codeAddress">Search</button>
          </div>
        </div>
      </div>
      <!-- <gmap-map
        :center="center"
        :zoom="10"
        map-type-id="terrain"
        style="width: 500px; height: 300px"
      > -->
      <!-- <GmapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="true"
          @click="center = m.position"
        /> -->
      <!-- </gmap-map> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
var geocoder;
var map: any;

// const apiKey = process.env.GOOGLE_API_KEY;

// window.initAutocomplete = this.initAutocomplete;

export default Vue.extend({
  auth: false,
  mounted() {
    // await this.$nextTick();
    // const coords = ;
    this.newLocation();
    // this.initMap();
    // this.initAutocomplete();
  },

  name: "PropertyUpload",
  components: {
    // regionsAndCities,
  },

  data() {
    return {
      step: 1 as number,
      searched: "",
      map: null,
      center: {
        latitude: 5.627703749893443,
        longitude: -0.08697846429555343,
      },
      // regions: {},
      latitude: 5.627703749893443 as number,
      longitude: -0.08697846429555343 as number,
    };
  },

  methods: {
    getSearch() {
      const iconBase =
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/";

      let mark = {
        position: new google.maps.LatLng(
          5.627703749893443,
          -0.58697846429555343
        ),
        type: iconBase + "parking_lot_maps.png",
      };

      const marker = new google.maps.Marker({
        position: mark.position,
        icon: mark.type,
        map: map,
      });

      // let markers: google.maps.Marker[] = [];
    },
    initMap(): void {
      let map: google.maps.Map;
      let service: google.maps.places.PlacesService;
      let infowindow: google.maps.InfoWindow;
      const sydney = new google.maps.LatLng(
        5.627703749893443,
        -0.0869784642955802
      );

      console.log("sydney", sydney);

      infowindow = new google.maps.InfoWindow();

      map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: sydney,
        zoom: 15,
      });
      console.log("map", map);
    },

    newLocation() {
      //   function initialize() {
      geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(
        5.627703749893443,
        -0.08697846429555343
      );
      var mapOptions = {
        zoom: 8,
        center: latlng,
      };
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
    },
    codeAddress() {
      var address = document.getElementById("address").value;
      geocoder.geocode({ address: address }, function (results, status) {
        console.log(status);
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
    // codeAddress() {
    //   var address = this.searched;
    //   geocoder.geocode({ address: address }, function (results, status) {
    //     if (status == "OK") {
    //       map.setCenter(results[0].geometry.location);
    //       var marker = new google.maps.Marker({
    //         map: map,
    //         position: results[0].geometry.location,
    //       });
    //     } else {
    //       alert(
    //         "Geocode was not successful for the following reason: " + status
    //       );
    //     }
    //   });
    // },
  },
});
</script>

<style lang="scss">
.map_container {
  width: 50%;
  margin: 20px auto;

  #map {
    height: 50vh;
    width: 100%;
  }
}
</style>
