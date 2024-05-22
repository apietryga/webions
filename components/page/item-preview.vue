<template>
    <div class="item preview"
        :style="`
            height: ${ img.size }px;
            background-image: url(/img/sprites/${sprite}.webp);
            background-position: ${ img.positionY }px ${ img.positionX }px; 
            background-size:${ img.backgroundSize };
            width: ${ img.size }px;
        `">
    </div>    
</template>

<script setup>

    const props = defineProps({
        sprite: {
            type: String,
            required: true,
        },
        spriteNr: {
            type: Number,
            default: null,
        }
    })

    const isItem = props.spriteNr !== null
    const img = {
        positionY: isItem ? (props.spriteNr * 40) - (props.spriteNr * 80) : 240,
        positionX: isItem ? 0  : -80,
        size:      isItem ? 40  : 80,
        backgroundSize: isItem ? props.sprite == 'action_items' ? 400 +'px 100%' : 800 +'px 100%' : 'unset',
    }

</script>