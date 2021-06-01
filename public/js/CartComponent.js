// const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

Vue.component('cart', {
    data(){
      return {
          cartUrl: '/getBasket.json',
          cartItems: [],
          showCart: false
      }
    },
    mounted(){
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for (let item of data.contents){
                    item.imgPath = `img1/s${item.id_product}.jpg`;
                    this.$data.cartItems.push(item);
                }
            });
    },
    methods: {
        addProduct(item){
            let find = this.cartItems.find(el => el.id_product === item.id_product);
            if(find){
                this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: 1})
                    .then(data => {
                        if(data.result === 1){
                            find.quantity++
                        }
                    })
            } else {
                const prod = Object.assign({quantity: 1}, item);
                this.$parent.postJson(`/api/cart`, prod)
                    .then(data => {
                        if(data.result === 1){
                            this.cartItems.push(prod)
                        }
                    })
            }

        },
        remove(item){
            let seach = this.cartItems.find(el=>el.id_product === item.id_product)
            if(item.quantity>1){
                item.quantity--;
            }else{
                this.cartItems.splice(this.cartItems.indexOf(seach),1);
            }
        },
    },
    template: `<span>
<button class="btn-cart" type="button" @click="showCart = !showCart"><img class="img_rightHeader"
src="img/basket.svg" alt="корзина"></button>
        <div class="cart-block" v-show="showCart">
            <cart-item v-for="item of cartItems" 
            :key="item.id_product" 
            :cart-item="item" 
            @remove="remove"
            @add="addProduct">
            </cart-item>
        </div>
        </span>
    `
});

Vue.component('cart-item', {
    props: ['cartItem'],
    template: `
    <div class="cart-item">
                    <div class="product-bio">
                        <div class="product-desc">
                            <div class="product-title">{{ cartItem.product_name }}</div>
                            <div class="product-quantity"> {{ cartItem.quantity }}</div>
                            <div class="product-single-price">$ {{ cartItem.price }}</div>
                        </div>
                    </div>
                    <div class="right-block">
                        <div class="product-price">{{cartItem.quantity*cartItem.price}}</div>
                        <button class="del-btn" @click="$emit('remove', cartItem)">&times;</button>
                    </div>
                </div>
    `
})