const fs = require("fs");
const http = require("http");

const sendRequest = (data) => {
    const options = {
        hostname: "localhost",
        port: 3000,
        path: "/orders",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length,
        },
    };

    const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on("data", (d) => {
            process.stdout.write(d);
        });
    });

    req.on("error", (error) => {
        console.error(error);
    });

    req.write(data);
    req.end();
};

const generateData = (callback) => {
    fs.readFile('products.json', (err, data) => {
        if (err) throw err;
        const products = JSON.parse(data);
        
        // Erzeugen von zufälligen Bestelldaten basierend auf den Produkten
        const orders = [];
        const numberOfProductsInOrder = Math.floor(Math.random() * 4) + 1; // 1 bis 4 Produkte pro Bestellung
        for (let i = 0; i < numberOfProductsInOrder; i++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const order = {
                productId: randomProduct.id,
                name: randomProduct.name,
                price: randomProduct.price,
                quantity: Math.floor(Math.random() * 5) + 1
            };
            orders.push(order);
        }

        // Wandeln Sie das Objekt in einen String um, um es zu senden
        const orderData = JSON.stringify(orders);
        callback(orderData);
    });
};

const initialize = () => {
    generateData(sendRequest);
};

initialize();