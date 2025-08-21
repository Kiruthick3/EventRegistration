require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./src/app");
const initAdmin = require("./src/helpers/initAdmin");

(async () => {
    await connectDB();
    await initAdmin();

    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();