<template>
  <div class="planet-list pa-4">
    <header>
      <div class="text-h6 text-center">List of planets</div>
    </header>
    <main>
      <div v-if="loading" class="planet-list__loading d-flex align-center justify-center">
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </div>
      <v-container v-else>
        <v-row  align="start" class="planet-list__header">
          <v-col cols="1" v-for="header in headers" :key="header.id">
              <div class="d-flex">
                <div>{{ header.text }}</div>
                <div class="planet-list__icon ml-2" v-if="header.id === 1">
                  <div v-if="direction === 1" @click="sortByName(-1)">&#9660;</div>
                  <div @click="sortByName(1)" v-else>&#9650;</div>
                </div>
              </div>
          </v-col>
        </v-row>
        <v-row  align="start" v-for="(planet, i) in planets" :class="{ 'planet-list__odd-row': i % 2 !== 0 }">
          <v-col class="planet-list__col"  cols="1" v-for="(characteristic, j) in planets[i]">
              <a class="planet-list__link" v-if="j === planets.length" :href="characteristic" target="_blank">{{ characteristic }}</a>
              <div v-else>{{ characteristic }}</div>
          </v-col>
        </v-row>      
      </v-container>
      <v-snackbar v-model="snackbar.show" :timeout="1000">
        {{ snackbar.text }}
      </v-snackbar>
    </main>
  </div>
</template>
<script>
import axios from 'axios'
  export default {
    name: 'App',
    data () {
      return {
        planets: [],
        loading: false,
        headers: [
          {
            id: 1,
            text: 'Name',
          },
          {
            id: 2,
            text: 'Rotation period',
          },
          {
            id: 3,
            text: 'Orbital period',
          },
          {
            id: 4,
            text: 'Diameter',
          },
          {
            id: 5,
            text: 'Climate',
          },
          {
            id: 6,
            text: 'Gravity',
          },
          {
            id: 7,
            text: 'Surface water',
          },
          {
            id: 8,
            text: 'Population',
          },
          {
            id: 9,
            text: 'Residents',
          },
          {
            id: 10,
            text: 'Films',
          },
          {
            id: 11,
            text: 'URL'
          }
        ],
        snackbar: {
          text: 'Something went wrong. Please try again later.',
          show: false
        },
        direction: 1
      }
    },
    async mounted () {
      try {
        this.loading = true
        await axios.get('https://swapi.dev/api/planets/')
          .then(response => {
            this.planets = this.planetsMapped(response.data.results)
            this.sortByName(this.direction)
          })
      } catch (error) {
        this.snackbar.show = true
      } finally {
        this.loading = false
      }
    },
    methods: {
      sortByName (direction) {
        this.direction = direction
        this.planets.sort((a, b) => {
          if (a < b) {
            return -1 * direction
          }
          if (a > b) {
            return 1 * direction
          }
          return 0
        })
      },
      planetsMapped (planets) {
        return planets.map(planet => {
          return [
            planet.name,
            planet.rotation_period,
            planet.orbital_period,
            planet.diameter,
            planet.climate,
            planet.gravity,
            planet.surface_water,
            planet.population,
            planet.residents.length,
            planet.films.length,
            planet.url
          ]
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.planet-list {
  main {
    overflow: auto;
    font-size: 12px;
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
    background-color: rgb(214, 214, 214);
  }
  &__loading {
    height: 500px;
  }
  &__icon {
    cursor: pointer;
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
