const stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'en',
    currency: "uah",
    token: function(token) {
        fetch('/card/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': _csrf
                
            },
            body: JSON.stringify({
                total: parseInt(document.querySelector('#card .card-body .list-group.list-group-flush .price').getAttribute('price')) * 100,
                stripeTokenId: token.id,
                items: []
            })
        }).then(async function(response) {
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        }).then(function(data) {
            console.log(data);
            alert("Оплата пройшла успішно!");
            window.location.href = "/orders"; 
        }).catch(function(error) {
            console.error(error);
            alert("Оплата не пройшла! Будь-ласка спробуйте ще раз.");
        });
    }
});


const stripeClick = () => {
    const price = document.querySelector('#card .card-body .list-group.list-group-flush .price').getAttribute('price');
    stripeHandler.open({
        amount: price * 100
    });
};
