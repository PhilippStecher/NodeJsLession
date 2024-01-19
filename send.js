const fs = require("fs").promises;
const http = require("http");

const sendRequest = async (data) => {
    const options = {
        hostname: "localhost",
        port: 3000,
        path: "/orders",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(data),
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

const generateData = async () => {
    try {
        const data = await fs.readFile("products.json");
        const products = JSON.parse(data);
        const orders = [];
        const numberOfProductsInOrder = Math.floor(Math.random() * 4) + 1; // 1 to 4 products per order
        for (let i = 0; i < numberOfProductsInOrder; i++) {
            const randomProduct =
                products[Math.floor(Math.random() * products.length)];
            const order = {
                productId: randomProduct.id,
                name: randomProduct.name,
                price: randomProduct.price,
                quantity: Math.floor(Math.random() * 5) + 1,
            };
            orders.push(order);
        }

        return JSON.stringify(orders);
    } catch (error) {
        console.error("Error generating data:", error);
    }
};

const initialize = async () => {
    const orderData = await generateData();
    if (orderData) {
        sendRequest(orderData);
    }
};

initialize();
