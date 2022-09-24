<template>
  <div>
    <div class="section property_upload">
      <div v-if="step === 1">
        <div class="map_container">
          <div id="map" ref="map"></div>
          <div class="mt-20">
            <input id="address" type="textbox" :value="searched" />
            <input type="button" value="Encode" @click="codeAddress" />
          </div>
        </div>
      </div>
      <hr class="hr_rule" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MapMarker from "./mapMarker.vue";
var geocoder;
var map;

// const apiKey = process.env.GOOGLE_API_KEY;

export default Vue.extend({
  mounted() {
    // await this.$nextTick();
    // const coords = ;
    this.newLocation();
  },

  name: "PropertyUpload",
  components: {
    MapMarker,
    // regionsAndCities,
  },

  data() {
    return {
      step: 1 as number,
      searched: "",
      map: null,
      // regions: {},
      latitude: 5.627703749893443 as number,
      longitude: -0.08697846429555343 as number,
      mylatitude: 6.627703749893443 as number,
      mylongitude: -1.08697846429555343 as number,
      newlatitude: 6.627703749893443 as number,
      newlongitude: -1.08697846429555343 as number,
    };
  },

  methods: {
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

      // const marker = new google.maps.Marker({
      //   position: sydney,
      //   map: map,
      // });

      const request = {
        query: "melcome , Kumasi",
        fields: ["name", "geometry"],
      };

      service = new google.maps.places.PlacesService(map);
      console.log(service);

      service.findPlaceFromQuery(
        request,
        (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
              console.log(results[i]);
              this.createMarker(results[i]);
            }

            map.setCenter(results[0].geometry!.location!);
          }
        }
      );
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
      var address = this.searched;
      console.log(geocoder);
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
    getMap(callback) {
      let vm = this;
      function checkForMap() {
        if (vm.map) callback(vm.map);
        else setTimeout(checkForMap, 200);
      }
      checkForMap();
    },
    setMap() {
      //   this.newLocation();
    },
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
