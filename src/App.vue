<template>
  <div class="planet-list pa-4">
    <header>
      <div class="text-h6 text-center">List of planets</div>
    </header>
    <main>
      <div
        v-if="loading"
        class="planet-list__loading d-flex align-center justify-center"
      >
        <v-progress-circular indeterminate color="primary" />
      </div>
      <v-container v-else>
        <v-row align="start" class="planet-list__header">
          <v-col cols="1" v-for="header in headers" :key="header.id">
            <div class="d-flex">
              <div>{{ header.text }}</div>
              <div class="planet-list__icon ml-2" v-if="header.id === 1">
                <div v-if="direction === 1" @click="sortByName(-1)">
                  &#9660;
                </div>
                <div @click="sortByName(1)" v-else>&#9650;</div>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row
          align="start"
          v-for="(planet, i) in planets"
          :class="{ 'planet-list__odd-row': i % 2 !== 0 }"
        >
          <v-col
            class="planet-list__col"
            cols="1"
            v-for="(characteristic, j) in planets[i].data"
          >
            <a
              class="planet-list__link"
              v-if="j === planets.length"
              :href="characteristic.text"
              target="_blank"
              >{{ characteristic.text }}</a
            >
            <div v-else>
              <div
                v-if="
                  characteristic.extraData && characteristic.extraData.length
                "
              >
                <div
                  class="planet-list__resident"
                  @click="openExtraData(characteristic.extraData)"
                >
                  {{ characteristic.text }}
                </div>
              </div>
              <div v-else>
                {{ characteristic.text }}
              </div>
            </div>
          </v-col>
        </v-row>
        <v-progress-linear
          v-if="progressLoading"
          indeterminate
          color="purple"
        />
      </v-container>
      <custom-dialog
        :content="extraData"
        :openDialog="openDialog"
        :loadingDialog="loadingDialog"
        @update:openDialog="(value) => (openDialog = value)"
      />
      <v-snackbar v-model="snackbar.show" :timeout="1000">
        {{ snackbar.text }}
      </v-snackbar>
    </main>
    <v-pagination
      class="mt-4"
      :length="pageCount"
      v-model="page"
      @update:modelValue="getPlanets"
    ></v-pagination>
  </div>
</template>
<script lang="ts">
import axios from "axios";
import CustomDialog from "./components/CustomDialog.vue";
import { HEADERS } from "./constants";
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
  components: {
    CustomDialog,
  },
  data() {
    return {
      planets: [] as Array<{
        name: string;
        data: Array<{
          text: string;
          extraData?: string[];
        }>;
      }>,
      loading: false as boolean,
      openDialog: false as boolean,
      headers: HEADERS, // You might need to specify the type for HEADERS
      snackbar: {
        text: "Something went wrong. Please try again later.",
        show: false,
      } as { text: string; show: boolean },
      direction: 1 as number,
      extraData: [] as Array<{
        name?: string;
        height?: string;
        mass?: string;
        title?: string;
        director?: string;
        producer?: string;
      }>,
      loadingDialog: false as boolean,
      pageCount: 0 as number,
      page: 1 as number,
      progressLoading: false as boolean,
    };
  },
  async mounted() {
    this.loading = true;
    await this.getPlanets();
    this.loading = false;
  },
  methods: {
    sortByName(direction: number) {
      this.direction = direction;
      this.planets.sort((a: { name: number }, b: { name: number }) => {
        if (a.name < b.name) {
          return -1 * direction;
        }
        if (a.name > b.name) {
          return 1 * direction;
        }
        return 0;
      });
    },
    planetsMapped(planets: any[]) {
      return planets.map(
        (planet: {
          name: string;
          rotation_period: string;
          orbital_period: string;
          diameter: string;
          climate: string;
          gravity: string;
          surface_water: string;
          population: string;
          residents: string | string[];
          films: string | string[];
          url: string;
        }) => {
          return {
            name: planet.name,
            data: [
              {
                text: planet.name,
              },
              {
                text: planet.rotation_period,
              },
              {
                text: planet.orbital_period,
              },
              {
                text: planet.diameter,
              },
              {
                text: planet.climate,
              },
              {
                text: planet.gravity,
              },
              {
                text: planet.surface_water,
              },
              {
                text: planet.population,
              },
              {
                text: planet.residents.length
                  ? planet.residents.length
                  : "No residents",
                extraData: planet.residents,
              },
              {
                text: planet.films.length ? planet.films.length : "No films",
                extraData: planet.films,
              },
              {
                text: planet.url,
              },
            ],
          };
        }
      );
    },
    async getPlanets() {
      this.progressLoading = true;
      try {
        await axios
          .get(`https://swapi.dev/api/planets/?page=${this.page}`)
          .then((response) => {
            this.planets = this.planetsMapped(response.data.results);
            this.sortByName(this.direction);
            this.pageCount = Math.ceil(
              response.data.count / this.planets.length
            );
          });
      } catch (error) {
        this.snackbar.show = true;
      } finally {
        this.progressLoading = false;
      }
    },
    async openExtraData(extraData: string[]) {
      this.openDialog = true;
      this.loadingDialog = true;
      await Promise.all(extraData.map((data: string) => axios.get(data))).then(
        (extraData) => {
          this.extraData = extraData.map((data) => {
            const isResident = !!data.data.name;
            if (isResident) {
              return {
                name: data.data.name,
                height: data.data.height,
                mass: data.data.mass,
              };
            } else {
              return {
                title: data.data.title,
                director: data.data.director,
                producer: data.data.producer,
              };
            }
          });
        }
      );
      this.loadingDialog = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.planet-list {
  main {
    overflow: auto;
    font-size: 13px;
    min-width: 900px;
  }
  &__header {
    background-color: rgb(50, 49, 49);
    margin-top: 20px;
    color: white;
    font-size: 13px;
    font-weight: 900;
  }
  &__odd-row {
    background-color: #eaeaea;
  }
  &__loading {
    height: 500px;
  }
  &__icon {
    cursor: pointer;
  }
  &__resident {
    cursor: pointer;
    color: blue;
  }

  @media (max-width: 1300px) {
    &__col {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
