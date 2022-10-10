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
import Vue from "vue";

export default Vue.extend({
  name: "map",
  mounted() {
    // this.initAutocomplete();
    this.newLocation();
  },

  data() {
    return {
      step: 1 as number,
      searched: "",
      map: null,
      // regions: {},
      latitude: 5.627703749893443 as number,
      longitude: -0.08697846429555343 as number,
    };
  },

  methods: {
    // initAutocomplete() {
    //   map = new google.maps.Map(this.$refs["map"] as HTMLElement, {
    //     center: { lat: 5.627703749893443, lng: -0.08697846429555343 },
    //     zoom: 13,
    //     // mapTypeId: "roadmap",
    //   });
    //   const input = this.$refs["search"] as HTMLInputElement;
    //   const searchBox = new google.maps.places.SearchBox(input);

    //   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    //   // Bias the SearchBox results towards current map's viewport.
    //   map.addListener("bounds_changed", () => {
    //     searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
    //   });

    //   let markers: google.maps.Marker[] = [];

    //   // Listen for the event fired when the user selects a prediction and retrieve
    //   // more details for that place.
    //   searchBox.addListener("places_changed", () => {
    //     const places = searchBox.getPlaces();

    //     // console.log(
    //     //   places.geometry.location.lat(),
    //     //   places.geometry.location.lng()
    //     // );
    //     if (places.length == 0) {
    //       return;
    //     }

    //     // Clear out the old markers.
    //     markers.forEach((marker) => {
    //       marker.setMap(null);
    //     });
    //     markers = [];

    //     // For each place, get the icon, name and location.
    //     const bounds = new google.maps.LatLngBounds();

    //     places.forEach((place) => {
    //       if (!place.geometry || !place.geometry.location) {
    //         console.log("Returned place contains no geometry");
    //         return;
    //       }

    //       const icon = {
    //         url: place.icon as string,
    //         size: new google.maps.Size(71, 71),
    //         origin: new google.maps.Point(0, 0),
    //         anchor: new google.maps.Point(17, 34),
    //         scaledSize: new google.maps.Size(25, 25),
    //       };

    //       // Create a marker for each place.
    //       markers.push(
    //         new google.maps.Marker({
    //           map,
    //           icon,
    //           title: place.name,
    //           position: place.geometry.location,
    //         })
    //       );

    //       console.log(place);
    //       const geoCode = {
    //         latitude: place.geometry.location.lat(),
    //         longitude: place.geometry.location.lng(),
    //         location: place.formatted_address,
    //       };

    //       this.$emit("latlng", geoCode);

    //       if (place.geometry.viewport) {
    //         // Only geocodes have viewport.
    //         bounds.union(place.geometry.viewport);
    //       } else {
    //         bounds.extend(place.geometry.location);
    //       }
    //     });
    //     map.fitBounds(bounds);
    //   });
    // },
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
      const map = new google.maps.Map(
        document.getElementById("map"),
        mapOptions
      );
      let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: latlng,
      });

      infoWindow.open(map);

      // Configure the click listener.

      map.addListener("click", (mapsMouseEvent: any) => {
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

        this.$emit("latlng", geoCode);

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
