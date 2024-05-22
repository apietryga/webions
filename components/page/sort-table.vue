<template>
    <div class="sorttable">
        <div class="scrollWrapper" style="display:block"></div>
        <div class="scrollWrapper">
            <table>
                <thead>
                    <th v-for="key in headers">
                        <page-pictogram :name="key"/>
                    </th>
                </thead>
                <tbody>
                    <tr v-for="item in items">
                        <td v-for="key in headers">
                            <template v-if="key == ''">
                                <page-item-preview 
                                    :sprite="item.sprite"
                                    :spriteNr="item.spriteNr"
                                />
                            </template>
                            <template v-else>
                                {{ item[key] }}
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">

    import { ref, onMounted } from 'vue'

    const items = ref([])
    const headers = ref([])
    const props = defineProps({
        items_type: {
            type: String,
            required: true,
        }
    })

    const getItems = async () => {
        items.value = await $fetch('/api/assets/items')        
    }

    const properties = {
        items: {
            headers: [
                '',
                'name',
                'fist',
                'dist',
                'health',
                'def',
                'health',
                'speed',
                'mana',
                'cap'
            ],
            items: [

            ]
        },
        monsters: {
            items: []
        }
    }

    onMounted(() => {
        getItems()
        headers.value = properties[props.items_type].headers
    })

</script>