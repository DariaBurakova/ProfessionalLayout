Vue.component('products', {
    data(){
        return {
            catalogUrl: `/catalogData.json`,
            products: [],
            filtered: [],
        }
    },
    methods: {
        filter(value){
            let regexp = new RegExp(value, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
    mounted(){
        this.$parent.getJson(`/api/products`)
            .then(data => {
                for(let el of data){
                    this.products.push(el);
                    this.filtered.push(el);
                }
            });
    },
    template: `<div class="products container">
            <product 
            v-for="product of filtered" 
            :key="product.id_product"
            :product="product"
            :img="product.imgProduct"></product>
        </div>`
});
Vue.component('product', {
    props: ['product', 'img'],
    template: `<div class="product-item " >
                <img :src="img" :alt="product.product_name">
                <div class="desc">
                    <h3>{{ product.product_name }}</h3>
                    <p>{{ product.price }} руб.</p>
                    <button class="buy-btn " @click="$root.$refs.cart.addProduct(product)">Купить</button>
                </div>
            </div>`
})