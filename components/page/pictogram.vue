<template>
    <span>
        <template v-if="index == -1">
            {{ props.name }}
        </template>
        <template v-else>
            <div class="itemContainer" 
                :style="`width: 25px;
                    height: 25px;
                    background-image: url('/img/signs.svg');
                    background-size: auto 100%;
                    margin: auto;
                    background-position:${ bgPosition };
                ;`">
            </div>
        </template>


        <!-- 
        {% set ico = key | getIco %}
        {% if not ico.name and ico.name == "" %}
        <div class="itemContainer" style="width: 25px;
            height: 25px;
            background-image: url('/img/signs.svg');
            background-size: auto 100%;
            margin: auto;
            background-position:{{ ico.bgPosition }};"
        ></div>
        {% if icoValue %} {{ icoValue }} {% endif %}
        {% elif not icoValue and icoValue != 0 %}
        {{ico.name}}
        {% endif %}
        -->
    </span>
</template>

<script setup>
    
    const props = defineProps({
        name: {
            type: String,
            required: true,
        }
    })

    const available_icons = [
        'fist', 
        'dist',
        'mana', 
        'manaRegen',
        'def', 
        'health',
        'healing',
        'healthRegen', 
        'speed', 
        'exp',
    ]

    const index = available_icons.indexOf(props.name)
    const bgPosition =  '-'+( index * 25 )+'px 0px'

</script>