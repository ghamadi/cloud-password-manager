<template>
  <div>
    <section>
      <nav-link
        v-for="(category, index) in categories"
        :key="index"
        :to="category.to"
        :icon="category.icon"
        :title="category.label"
      ></nav-link>
    </section>

    <v-divider class="my-5"></v-divider>

    <section v-if="tags.length > 1" class="tags-section pb-4">
      <nav-link
        v-for="(tag, index) in tagsToShow"
        :key="index"
        :to="tag.to"
        :icon="tag.icon"
        :title="tag.title"
        :class="`tag-nav-link`"
      ></nav-link>

      <div v-if="tags.length > tagsLimit">
        <v-divider></v-divider>
        <v-btn
          text
          plain
          :ripple="false"
          width="100%"
          class="text-lowercase font-weight-light"
          @click="tagsLimit = parseInt(tagsLimit * 1.5)"
        >
          show more tags
        </v-btn>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      tagsLimit: 5,
    }
  },
  computed: {
    ...mapGetters({ items: 'items/itemsList' }),
    categories() {
      const tag = this.$route.query.tag
      const suffix = tag ? `tag=${tag}` : ''

      const allCategories = [
        {
          to: `/items${suffix && '?'}${suffix}`,
          icon: 'mdi-hexagon-multiple',
          label: 'All Categories',
        },
      ]

      return allCategories.concat(
        this.$categories.map((category) =>
          Object.assign(
            {
              to: `/items?category=${category.categoryID}${
                suffix && '&'
              }${suffix}`,
            },
            category
          )
        )
      )
    },

    tags() {
      const category = this.$route.query.category
      const prefix = category ? `category=${category}` : ''
      let tagsArr = this.items.reduce((acc, curr) => {
        return new Set([...acc, ...new Set(curr.tags)])
      }, new Set([]))

      const allTags = [
        {
          to: `/items${prefix && '?'}${prefix}`,
          icon: 'mdi-tag-multiple',
          title: 'All tags',
        },
      ]

      tagsArr = [...tagsArr].sort((t1, t2) =>
        t1.localeCompare(t2, undefined, { numeric: true })
      )

      return allTags.concat(
        tagsArr.map((t) => ({
          to: `/items?${prefix}${prefix && '&'}tag=${t}`,
          icon: 'mdi-tag',
          title: t,
        }))
      )
    },

    tagsToShow() {
      return this.tags.slice(0, this.tagsLimit)
    },
  },
}
</script>

<style>
/* width */
::-webkit-scrollbar {
  width: 7px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #e4e4e42d;
  border: none;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.tag-nav-link {
  width: 100%;
}

.tags-section {
  overflow: hidden;
  overflow-y: auto;
}
</style>
