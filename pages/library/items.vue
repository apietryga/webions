<template>
    <div class="items">

        <page-sort-table items_type="items">
        </page-sort-table>

    </div>
</template>

<script setup>


//   const tableSorting_{{tableClass}} = {
//     desc: true,
//     trs: document.querySelectorAll('.{{tableClass}} tbody tr'),
//     init(){
//       document.querySelectorAll(".{{tableClass}} thead .itemContainer").forEach( itemContainer => {
//         itemContainer.onclick = e => {
//           const th = e.target.parentElement
//           const nodes = Array.prototype.slice.call( th.parentElement.children );
//           this.sort( nodes.indexOf( th ) )
//         }
//       })
//     },
//     sort( index ){
//       this.desc = !this.desc
//       const trs = Array.prototype.slice.call( this.trs )
//       trs.sort(function(a, b) {
//         let keyA = a.children[index].innerText, 
//         keyB = b.children[index].innerText;

//         if(!isNaN(keyA)){
//           keyA = keyA*1
//           keyB = keyB*1
//         }
//         if (keyA < keyB) return tableSorting_{{tableClass}}.desc ? -1 : 1;
//         if (keyA > keyB) return tableSorting_{{tableClass}}.desc ? 1: -1;
//         return 0;
//       });
//       document.querySelector('.{{tableClass}} tbody').innerHTML = ""
//       for(const tr of trs){
//         document.querySelector('.{{tableClass}} tbody').append(tr)
//       }
//     }
//   }
//   tableSorting_{{tableClass}}.init()
</script>