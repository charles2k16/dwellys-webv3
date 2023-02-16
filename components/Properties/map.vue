<template>
  <div class="">
    <div id="map" ref="map"></div>
    <div class="mt-20">
      <!-- <input
        id="pac-input"
        class="controls"
        placeholder="Search location"
        ref="search"
        type="textbox"
        :value="searched"
      /> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'map',
  mounted() {
    // this.initAutocomplete();
    this.newLocation();
  },

  data() {
    return {
      step: 1 as number,
      searched: '',
      map: null,
      // regions: {},
      latitude: 5.627703749893443 as number,
      longitude: -0.08697846429555343 as number,
    };
  },

  methods: {
    newLocation() {
      // let geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(
        5.627703749893443,
        -0.08697846429555343
      );

      var mapOptions = {
        zoom: 14,
        center: latlng,
      };
      const map = new google.maps.Map(this.$refs['map'], mapOptions);
      let infoWindow = new google.maps.InfoWindow({
        content: 'Click the map to get Lat/Lng!',
        position: latlng,
      });

      infoWindow.open(map);

      // Configure the click listener.

      map.addListener('click', (mapsMouseEvent: any) => {
        // Close the current InfoWindow.
        infoWindow.close();
        // let marker;

        // marker = new google.maps.Marker({
        //   position: mapsMouseEvent.latLng,
        //   map: map,
        // });
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
          position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
          JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
        );

        const geoCode = {
          latitude: mapsMouseEvent.latLng.lat(),
          longitude: mapsMouseEvent.latLng.lng(),
        };

        this.$emit('latlng', geoCode);

        infoWindow.open(map);
      });
    },
  },
});
</script>

<style lang="scss">
#map {
  height: 400px;
  width: 100%;
}
.controls {
  position: absolute !important;
  left: 10px !important;
  top: 45px !important;
  width: 95%;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
}
</style>
