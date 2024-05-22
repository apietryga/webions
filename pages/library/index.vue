<template>
  <div class="index">
    <article>
        <nuxt-link to="./library/install">Install Client</nuxt-link>
        <p>
            You can simply install {{name}} game on your 
            <nuxt-link :to="{ path: 'library/install', hash: '#windows'}">Windows</nuxt-link>,
            <nuxt-link :to="{ path: 'library/install', hash: '#android'}">Android</nuxt-link> and 
            <nuxt-link :to="{ path: 'library/install', hash: '#ios'}">iOS</nuxt-link> device in steps.
        </p>
    </article>
    <article>
      <nuxt-link to="./library/controls">Controls</nuxt-link>
      <p>
        Few information about controls in game. Here you can learn about
        <nuxt-link :to="{ path: 'library/controls', hash: '#wt'}">white targeting</nuxt-link>, 
        <nuxt-link :to="{ path: 'library/controls', hash: '#rt'}">red targeting</nuxt-link>, 
        <nuxt-link :to="{ path: 'library/controls', hash: '#ds'}">distance shooting</nuxt-link> and 
        <nuxt-link :to="{ path: 'library/controls', hash: '#healing'}">healing</nuxt-link>.
      </p>
    </article>
    <article>
      <nuxt-link to="./library/items">Items</nuxt-link>
      <p>
        Here you've list of items from the game. 
      </p>
    </article>
    <article>
      <nuxt-link to="./library/monsters">Monsters</nuxt-link>
      <p>
        Here you've list of monsters from the game. 
      </p>
    </article>
    <article>
      <nuxt-link to="./library/about">About</nuxt-link>
      <p>
        here's info about authors
      </p>
    </article>

  </div>

</template>

<script setup>
  const name = "Webions"
</script>