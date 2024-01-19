const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const ordersDir = path.join(__dirname, "/orders");
const ordersFile = path.join(ordersDir, "order.json");

// Ensure /orders directory exists
const ensureOrdersDir = async () => {
    try {
        await fs.access(ordersDir);
    } catch {
        await fs.mkdir(ordersDir, { recursive: true });
    }
};
ensureOrdersDir();

// Save an order to order.json
const saveOrder = async (orderData) => {
    try {
        let orders = [];
        try {
            const data = await fs.readFile(ordersFile);
            orders = JSON.parse(data.toString());
        } catch (err) {
            if (err.code !== "ENOENT") throw err; // Ignore file not found errors
        }

        const total = orderData.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        const order = {
            id: uuidv4(),
            date: new Date().toISOString(),
            total: total.toFixed(2),
            items: orderData,
        };

        orders.push(order);

        await fs.writeFile(ordersFile, JSON.stringify(orders, null, 4));
    } catch (err) {
        console.error("Error processing order:", err);
    }
};

app.post("/orders", async (req, res) => {
    console.log("Received order:", req.body);
    await saveOrder(req.body);
    res.status(200).send("Order received and processed");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
