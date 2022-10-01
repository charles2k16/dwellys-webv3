<template>
  <div class="">
    {{ lat }}-{{ lng }}
    <div id="map" ref="map"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// var geocoder;
var map: any;

export default Vue.extend({
  props: {
    lat: {
      type: String,
      required: true,
    },
    lng: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.initMap();
  },

  data() {
    return {
      step: 1 as number,
      searched: "",
      map: null,
    };
  },

  methods: {
    initMap(): void {
      // The location of Uluru
      // { lat: -25.344, lng: 131.031 }
      const uluru = { lat: parseInt(this.lat), lng: parseInt(this.lng) };
      // The map, centered at Uluru
      const map = new google.maps.Map(this.$refs["map"] as HTMLElement, {
        zoom: 4,
        center: uluru,
      });

      // The marker, positioned at Uluru
      const marker = new google.maps.Marker({
        position: uluru,
        map: map,
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
  margin-top: 10px;
  padding: 10px;
  border: 1px solid black;
  border-radius: 10px;
}
</style>
