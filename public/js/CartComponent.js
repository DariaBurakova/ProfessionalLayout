Vue.component( 'cart', {
    data() {
        return {
            showCart: false,
            cartItems: [],
        }
    },
    methods: {
        addProduct( product ) {
            let find = this.cartItems.find( el => el.id_product === product.id_product );
            if ( find ) {
                this.$parent.putJson( `/api/cart/${ product.id_product }/${ product.product_name }`, { quantity: 1 } )
                    .then( data => {
                        if ( data.result ) {
                            find.quantity++;
                        }
                    } )
            } else {
                let prod = Object.assign( { quantity: 1 }, product );
                this.$parent.postJson( `api/cart/${ product.id_product }/${ product.product_name }`, prod )
                    .then( data => {
                        if ( data.result ) {
                            this.cartItems.push( prod );
                        }
                    } )
            }
        },
        remove( product ) {
            if ( product.quantity > 1 ) {
                this.$parent.putJson( `/api/cart/${ product.id_product }/${ product.product_name }`, { quantity: -1 } )
                    .then( data => {
                        if ( data.result ) {
                            product.quantity--;
                        }
                    } )
            } else {
                this.$parent.delJson( `/api/cart/${ product.id_product }/${ product.product_name }`, product )
                    .then( data => {
                        if ( data.result ) {
                            this.cartItems.splice( this.cartItems.indexOf( product ), 1 );
                        } else {
                            console.log( 'error' );
                        }
                    } )
            }
        },
    },
    mounted() {
        this.$parent.getJson( `/api/cart` )
            .then( data => {
                for ( let el of data.contents ) {
                    this.cartItems.push( el )
                }
            } );
    },
    template: `<span>
<button class="btn-cart" type="button" @click='showCart = !showCart'><img class="img_rightHeader"
src="img/basket.svg" alt="корзина"></button>
<div class="cart-block" v-show="showCart">
                <p v-if="!cartItems.length">В корзине пока пусто</p>
                <cart-item 
                v-for="item of cartItems" 
                :key="item.id_product"
                :cart-item="item"
                :img="item.imgCart"
                @remove="remove"></cart-item>
        </div>   
        </span> 
`
} );
Vue.component( 'cart-item', {
    props: [ 'cartItem', 'img' ],
    template: `<div class="cart-item">
                <div class="product-bio">
                    <img :src="img" alt="Some image">
                    <div class="product-desc">
                        <p class="product-title">{{cartItem.product_name}}</p>
                        <p class="product-quantity">Количество: {{cartItem.quantity}}</p>
                        <p class="product-single-price">{{cartItem.price}} руб. за шт.</p>
                    </div>
                </div>
                <div class="right-block">
                    <p class="product-price">Всего: {{cartItem.quantity*cartItem.price}} руб.</p>
                    <button class="del-btn" @click="$emit('remove', cartItem)">&times;</button>
                </div>
            </div>`
} )