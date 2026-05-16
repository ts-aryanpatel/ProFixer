import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/db.js";


const PORT = config.PORT || 3000;


const server = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
};


server();
