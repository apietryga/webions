<template>

  <div class="background">
    <img src="/img/acc_page/1.webp" alt="background 1" class="active">
    <img src="/img/acc_page/2.webp" alt="background 2">
    <img src="/img/acc_page/3.webp" alt="background 3">
    <img src="/img/acc_page/4.webp" alt="background 4">
    <img src="/img/acc_page/5.webp" alt="background 5">
    <img src="/img/acc_page/6.webp" alt="background 6">
    <img src="/img/acc_page/7.webp" alt="background 7">
    <img src="/img/acc_page/8.webp" alt="background 8">
    <img src="/img/acc_page/9.webp" alt="background 9">
  </div>

  <main>
    <div class="window" :class="{active: active_window == 'login'}" id="login">
      <!-- <h2>{{action}}</h2> -->
      <div class="window-inside">

        <!-- <div class="message">{{ message | safe}}</div> -->
        <!-- {# <form action="/acc/login" method="post"> #} -->
        <form action="/game" method="post">
          <div class="nick">
            <label for="nick">Username:</label>
            <input 
              type="text" 
              id="nick" 
              name="nick" 
              placeholder="nick"
              autocomplete="nick"
            >
          </div>
          <div class="pass">
            <label for="password">Password:</label>
            <input type="password" 
              id="password" name="password" 
              placeholder="password"
              autocomplete="current-password"
            >
          </div>
          <div class="buttons">
            <input type="submit" value="Ok" name="type">  
            <button class="btn" @click.prevent="active_window = null">Cancel</button>
          </div>
        </form>

      </div>
    </div>
    <div class="window" :class="{active: active_window == 'register'}" id="register">
      <!-- <h2>{{action}}</h2> -->
      <div class="window-inside">
        <!-- {{ message | safe }} -->

        <form action="/acc/register" method="post">
          <div class="nick">
            <input 
              type="text" 
              placeholder="nick" 
              name="nick"
              autocomplete="nick"
            >
          </div>
          <div class="pass">
            <input 
              type="password" 
              name="password" 
              placeholder="password"
              autocomplete="current-password"
            >
          </div>
          <div class="pass">
            <input type="text" placeholder="email" name="email">
          </div>
          <div class="pass">
            <div class="sex">
              <legend>
                <input type="radio" name="sex" value="male" id="male" checked >
                <label for="male">male</label>
              </legend>
              <legend>
                <input type="radio" name="sex" value="female" id="female">  
                <label for="female">female</label>
              </legend>
            </div>
          </div>
          <div class="buttons">
            <input type="submit" value="Register" name="type">
            <button class="btn" @click.prevent="active_window = null">Cancel</button>
          </div>
        </form>

      </div>
    </div>
    <div class="window" :class="{active: active_window == 'forgot'}" id="forgot">
      <!-- <h2>{{action}}</h2> -->
      <div class="window-inside">

        <form action="/acc/forgot" method="post">
          <div class="email">
            <input 
              type="text" 
              placeholder="nick" 
              name="nick"
              autocomplete="nick"
            >
          </div>
          <div class="buttons">
            <input type="submit" value="Remind" name="type">
            <button class="btn" @click.prevent="active_window = null">Cancel</button>
          </div>
        </form>

      </div>
    </div>
    <div class="window" :class="{active: active_window == 'newpass'}" id="newpass">
      <!-- <h2>{{action}}</h2> -->
      <div class="window-inside">

        <form action="/acc/newpass" method="post">
          <input type="text" name="username" autocomplete="username" style="display:none">
          <input type="hidden" name="passToken">
          <div class="pass">
            <input 
              type="password" 
              placeholder="new&nbsp;password" 
              name="newpass"
              autocomplete="new-password"
            >
          </div>
          <input type="submit" value="CHANGE" name="type">
        </form>

      </div>
    </div>
    <div class="window" :class="{active: active_window == 'result'}" id="result">
      <!-- <h2>{{action}}</h2> -->
      <div class="window-inside">

        <form action="acc" method="get">
          <!-- {{ message | safe}} -->
          <div class="buttons">
            <button class="btn" @click.prevent="active_window = null">Cancel</button>
          </div>
        </form>

      </div>
    </div>
    <div class="window" :class="{active: active_window == 'logout'}" id="logout">
      <!-- <h2>{{action}}</h2> -->
      <div class="window-inside">

        <form action="/acc/logout" method="get">
          <input type="hidden" name="logout" value="true">
        </form>
      </div>
    </div>
  </main>
  
  <footer>
    <div class="options">
      <button class="btn" @click="active_window = 'login'">Login</button>
      <button class="btn" @click="active_window = 'forgot'">Forgot</button>
      <button class="btn" @click="active_window = 'register'">Register</button>
      <nuxt-link class="btn" to="/">Home</nuxt-link>
    </div>
  </footer>
</template>

<script setup lang="ts">

    // @ts-nocheck
    definePageMeta({ layout: 'auth' })

    let slides_interval: any;
    const active_window = ref()

    onMounted(() => {
        slides_interval = setInterval(()=>{
            const bgs = document.querySelectorAll('.background img');
            for(const [index, img] of bgs.entries()){
                if(img.classList.contains('active')){
                bgs[index < bgs.length - 1 ? index + 1 : 0 ].classList.add('active')
                img.classList.remove('active')
                break
                }
            }
        },15000)
    })

    onUnmounted(() => {
        clearInterval(slides_interval)
    })

</script>
